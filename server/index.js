import express from 'express';
import cors from 'cors';
import maxmind from 'maxmind';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// GeoIP Database readers
let cityLookup = null;
let asnLookup = null;

// Initialize MaxMind databases
async function initDatabases() {
  try {
    const dataDir = join(__dirname, '..', 'data');
    cityLookup = await maxmind.open(join(dataDir, 'GeoLite2-City.mmdb'));
    asnLookup = await maxmind.open(join(dataDir, 'GeoLite2-ASN.mmdb'));
    console.log('✅ GeoIP databases loaded successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to load GeoIP databases:', error.message);
    console.log('💡 Make sure to download databases to ./data/ folder');
    console.log('   Run: mkdir -p data && cd data');
    console.log('   curl -L -o GeoLite2-City.mmdb "https://github.com/P3TERX/GeoLite.mmdb/releases/latest/download/GeoLite2-City.mmdb"');
    console.log('   curl -L -o GeoLite2-ASN.mmdb "https://github.com/P3TERX/GeoLite.mmdb/releases/latest/download/GeoLite2-ASN.mmdb"');
    return false;
  }
}

// Security middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));

// Rate limiting (simple in-memory)
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 100; // 100 requests per minute

app.use((req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  
  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, startTime: now });
  } else {
    const record = rateLimit.get(ip);
    if (now - record.startTime > RATE_LIMIT_WINDOW) {
      record.count = 1;
      record.startTime = now;
    } else {
      record.count++;
      if (record.count > RATE_LIMIT_MAX) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
      }
    }
  }
  next();
});

// Clean up rate limit map periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimit.entries()) {
    if (now - record.startTime > RATE_LIMIT_WINDOW * 2) {
      rateLimit.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW);

// Function to get IP info from local database
function getIPInfo(ip) {
  if (!cityLookup || !asnLookup) {
    return { error: 'GeoIP database not loaded' };
  }

  if (!ip || ip === '' || ip === '127.0.0.1' || ip === '::1') {
    return { error: 'Invalid or local IP address' };
  }

  try {
    const cityData = cityLookup.get(ip);
    const asnData = asnLookup.get(ip);

    if (!cityData && !asnData) {
      return { error: 'IP address not found in database' };
    }

    const isIPv6 = ip.includes(':');

    const result = {
      ip: ip,
      ipType: isIPv6 ? 'IPv6' : 'IPv4',
      country: cityData?.country?.names?.en || 'Unknown',
      countryCode: cityData?.country?.iso_code || 'XX',
      region: cityData?.subdivisions?.[0]?.names?.en || 'Unknown',
      regionCode: cityData?.subdivisions?.[0]?.iso_code || '',
      city: cityData?.city?.names?.en || 'Unknown',
      postalCode: cityData?.postal?.code || '',
      latitude: cityData?.location?.latitude || 0,
      longitude: cityData?.location?.longitude || 0,
      timezone: cityData?.location?.time_zone || 'Unknown',
      isp: asnData?.autonomous_system_organization || 'Unknown',
      organization: asnData?.autonomous_system_organization || 'Unknown',
      asName: asnData?.autonomous_system_number 
        ? `AS${asnData.autonomous_system_number} ${asnData.autonomous_system_organization || ''}`
        : 'Unknown',
      asn: asnData?.autonomous_system_number || null
    };

    // Add ipv4 or ipv6 field
    if (isIPv6) {
      result.ipv6 = ip;
    } else {
      result.ipv4 = ip;
    }

    return result;
  } catch (error) {
    console.error('Error looking up IP:', error.message);
    return { error: 'Failed to lookup IP address' };
  }
}

// Helper function to get client IP
function getClientIP(req) {
  const cfIP = req.headers['cf-connecting-ip'];
  const xRealIP = req.headers['x-real-ip'];
  const xForwardedFor = req.headers['x-forwarded-for'];
  
  let clientIP = cfIP || xRealIP || (xForwardedFor ? xForwardedFor.split(',')[0].trim() : '') || req.socket.remoteAddress || '';
  
  // Clean up IP
  clientIP = clientIP.replace('::ffff:', '');
  
  return clientIP;
}

// API endpoint for IP lookup (current user)
app.get('/ip', (req, res) => {
  const clientIP = getClientIP(req);
  
  console.log('Client IP:', clientIP);
  
  if (!clientIP || clientIP === '127.0.0.1' || clientIP === '::1') {
    return res.json({ 
      error: 'Could not determine your IP address',
      message: 'You are accessing from localhost'
    });
  }
  
  const info = getIPInfo(clientIP);
  res.json(info);
});

// API endpoint for specific IP lookup
app.get('/ip/:ip', (req, res) => {
  const { ip } = req.params;
  
  // Validate IP format (basic validation)
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
  
  if (!ipv4Regex.test(ip) && !ipv6Regex.test(ip)) {
    return res.status(400).json({ error: 'Invalid IP address format' });
  }
  
  const info = getIPInfo(ip);
  res.json(info);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: cityLookup && asnLookup ? 'loaded' : 'not loaded'
  });
});

// Database info endpoint
app.get('/info', (req, res) => {
  res.json({
    version: '2.1.0',
    database: 'MaxMind GeoLite2 (Local)',
    features: ['IPv4', 'IPv6', 'City', 'Country', 'ASN', 'ISP', 'Timezone'],
    noExternalAPI: true
  });
});

// Start server
async function start() {
  const dbLoaded = await initDatabases();
  
  app.listen(PORT, () => {
    console.log(`\n🚀 API Server running on http://localhost:${PORT}`);
    console.log(`📦 Using LOCAL GeoLite2 Database (No external API)`);
    console.log(`\n📡 API Endpoints:`);
    console.log(`   GET /ip       - Get your IP information`);
    console.log(`   GET /ip/:ip   - Get information for a specific IP`);
    console.log(`   GET /health   - Health check`);
    console.log(`   GET /info     - API info`);
    
    if (!dbLoaded) {
      console.log(`\n⚠️  Warning: Database not loaded. API will return errors.`);
    }
  });
}

start();
