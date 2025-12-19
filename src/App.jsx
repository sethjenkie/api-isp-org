import { useState, useEffect } from 'react';
import './App.css';

const API_BASE = '';

// Get current site URL for API documentation
const getSiteUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'https://your-domain.com';
};

function App() {
  const [ipData, setIpData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchIp, setSearchIp] = useState('');
  const [activeTab, setActiveTab] = useState('home');

  const fetchIpInfo = async (ip = '') => {
    setLoading(true);
    setError(null);
    try {
      const url = ip ? `${API_BASE}/api/ip/${ip}` : `${API_BASE}/api/ip`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setIpData(null);
      } else {
        setIpData(data);
      }
    } catch (err) {
      setError('خطا در اتصال به سرور API. مطمئن شوید سرور روی پورت 3001 در حال اجراست.');
      setIpData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIpInfo();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchIp.trim()) {
      fetchIpInfo(searchIp.trim());
    }
  };

  const getCountryFlag = (countryCode) => {
    if (!countryCode) return '';
    return `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`;
  };

  const sampleResponse = {
    ip: "37.32.126.245",
    country: "Iran",
    countryCode: "IR",
    region: "Tehran",
    regionCode: "23",
    city: "Tehran",
    postalCode: "",
    latitude: 35.6944,
    longitude: 51.4215,
    timezone: "Asia/Tehran",
    isp: "Noyan Abr Arvan Co. ( Private Joint Stock)",
    organization: "ArvanCloud Global Technologies Inc.",
    asName: "AS202468 Noyan Abr Arvan Co. ( Private Joint Stock)"
  };

  return (
    <div className="app" dir="rtl">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <a href="/" className="logo">
            <span className="logo-icon">◉</span>
            RezvanGate
          </a>
          <nav className="nav">
            <a 
              href="#home" 
              className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}
            >
              خانه
            </a>
            <a 
              href="#api" 
              className={`nav-link ${activeTab === 'api' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveTab('api'); }}
            >
              مستندات API
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {/* Hero */}
        <section className="hero">
          <h1 className="hero-title">بررسی آدرس IP</h1>
          <p className="hero-subtitle">
            اطلاعات کامل درباره هر آدرس IP شامل موقعیت مکانی، ISP، سازمان و موارد بیشتر را دریافت کنید.
          </p>
        </section>

        {/* Search */}
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="آدرس IP را وارد کنید (مثال: 8.8.8.8)"
              value={searchIp}
              onChange={(e) => setSearchIp(e.target.value)}
              dir="ltr"
            />
            <button type="submit" className="search-btn" disabled={loading}>
              {loading ? '⟳' : '🔍'} جستجو
            </button>
          </form>
        </div>

        {activeTab === 'home' && (
          <>
            {/* Loading */}
            {loading && (
              <div className="loading">
                <div className="spinner"></div>
                <p>در حال دریافت اطلاعات IP...</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="error">
                <p>⚠️ {error}</p>
              </div>
            )}

            {/* IP Info Card */}
            {ipData && !loading && (
              <div className="ip-info-card">
                <div className="ip-header">
                  <div className="ip-display" dir="ltr">{ipData.ip}</div>
                  <div className="ip-label">آدرس IP</div>
                </div>
                
                <div className="ip-info-grid">
                  <div className="info-item">
                    <span className="info-label">🌍 کشور</span>
                    <span className="info-value">
                      {ipData.countryCode && (
                        <img 
                          src={getCountryFlag(ipData.countryCode)} 
                          alt={ipData.country} 
                          className="flag-icon"
                        />
                      )}
                      {ipData.country || 'نامشخص'}
                    </span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">🏷️ کد کشور</span>
                    <span className="info-value highlight" dir="ltr">{ipData.countryCode || 'نامشخص'}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">📍 منطقه</span>
                    <span className="info-value">{ipData.region || 'نامشخص'}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">🔖 کد منطقه</span>
                    <span className="info-value highlight" dir="ltr">{ipData.regionCode || 'نامشخص'}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">🏙️ شهر</span>
                    <span className="info-value">{ipData.city || 'نامشخص'}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">📮 کد پستی</span>
                    <span className="info-value" dir="ltr">{ipData.postalCode || 'نامشخص'}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">📐 عرض جغرافیایی</span>
                    <span className="info-value highlight" dir="ltr">{ipData.latitude || 'نامشخص'}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">📐 طول جغرافیایی</span>
                    <span className="info-value highlight" dir="ltr">{ipData.longitude || 'نامشخص'}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">🕐 منطقه زمانی</span>
                    <span className="info-value" dir="ltr">{ipData.timezone || 'نامشخص'}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">🌐 ISP</span>
                    <span className="info-value highlight" dir="ltr">{ipData.isp || 'نامشخص'}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">🏢 سازمان</span>
                    <span className="info-value" dir="ltr">{ipData.organization || 'نامشخص'}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">🔗 نام AS</span>
                    <span className="info-value highlight" dir="ltr">{ipData.asName || 'نامشخص'}</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'api' && (
          <section className="api-section">
            <h2 className="section-title">
              <span>⚡</span> مستندات API
            </h2>
            
            <div className="api-endpoints">
              {/* Endpoint 1 */}
              <div className="api-endpoint">
                <div className="endpoint-header">
                  <span className="method">GET</span>
                  <span className="endpoint-url" dir="ltr">/api/ip</span>
                </div>
                <div className="endpoint-body">
                  <p className="endpoint-desc">
                    اطلاعات آدرس IP فعلی شما را برمی‌گرداند.
                  </p>
                  <div className="code-block">
                    <pre dir="ltr">{`curl ${getSiteUrl()}/api/ip`}</pre>
                  </div>
                </div>
              </div>

              {/* Endpoint 2 */}
              <div className="api-endpoint">
                <div className="endpoint-header">
                  <span className="method">GET</span>
                  <span className="endpoint-url" dir="ltr">/api/ip/:ip</span>
                </div>
                <div className="endpoint-body">
                  <p className="endpoint-desc">
                    اطلاعات یک آدرس IP خاص را برمی‌گرداند.
                  </p>
                  <div className="code-block">
                    <pre dir="ltr">{`curl ${getSiteUrl()}/api/ip/37.32.126.245`}</pre>
                  </div>
                </div>
              </div>

              {/* Sample Response */}
              <div className="api-endpoint">
                <div className="endpoint-header">
                  <span className="method">JSON</span>
                  <span className="endpoint-url">نمونه پاسخ</span>
                </div>
                <div className="endpoint-body">
                  <p className="endpoint-desc">
                    نمونه پاسخ JSON از API (خروجی به انگلیسی است):
                  </p>
                  <div className="code-block">
                    <pre dir="ltr">{JSON.stringify(sampleResponse, null, 2)}</pre>
                  </div>
                </div>
              </div>

              {/* Response Fields */}
              <div className="api-endpoint">
                <div className="endpoint-header">
                  <span className="method">INFO</span>
                  <span className="endpoint-url">فیلدهای پاسخ</span>
                </div>
                <div className="endpoint-body">
                  <div className="ip-info-grid" style={{ background: 'transparent', gap: '0' }}>
                    <div className="info-item">
                      <span className="info-label" dir="ltr">ip</span>
                      <span className="info-value">آدرس IP</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label" dir="ltr">country</span>
                      <span className="info-value">نام کشور</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label" dir="ltr">countryCode</span>
                      <span className="info-value">کد ISO کشور</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label" dir="ltr">region</span>
                      <span className="info-value">نام منطقه/استان</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label" dir="ltr">regionCode</span>
                      <span className="info-value">کد منطقه</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label" dir="ltr">city</span>
                      <span className="info-value">نام شهر</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label" dir="ltr">postalCode</span>
                      <span className="info-value">کد پستی</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label" dir="ltr">latitude</span>
                      <span className="info-value">عرض جغرافیایی</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label" dir="ltr">longitude</span>
                      <span className="info-value">طول جغرافیایی</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label" dir="ltr">timezone</span>
                      <span className="info-value">منطقه زمانی (IANA)</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label" dir="ltr">isp</span>
                      <span className="info-value">ارائه‌دهنده اینترنت</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label" dir="ltr">organization</span>
                      <span className="info-value">نام سازمان</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label" dir="ltr">asName</span>
                      <span className="info-value">نام سیستم خودمختار</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          ساخته شده با <span className="footer-heart">♥</span> | RezvanGate - سرویس API بررسی IP
        </p>
      </footer>
    </div>
  );
}

export default App;
