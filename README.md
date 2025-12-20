# 🌐 RezvanGate - سرویس بررسی آدرس IP

<div dir="rtl">

یک سرویس وب مدرن برای بررسی و دریافت اطلاعات کامل آدرس‌های IP با رابط کاربری فارسی و API انگلیسی.

[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev)

**🔗 دمو زنده:** [https://rezvanproject.ir](https://rezvanproject.ir)

</div>

---

## 📑 فهرست مطالب

<div dir="rtl">

- [امکانات](#-امکانات)
- [پیش‌نیازها](#-پیشنیازها)
- [نصب سریع (توسعه)](#-نصب-سریع-توسعه)
- [نصب روی سرور (Production)](#-نصب-روی-سرور-production)
- [تنظیم Nginx](#-تنظیم-nginx)
- [تنظیم Cloudflare](#-تنظیم-cloudflare-اختیاری)
- [API Documentation](#-api-documentation)
- [ساختار پروژه](#-ساختار-پروژه)
- [رفع مشکلات](#-رفع-مشکلات)

</div>

---

<div dir="rtl">

## ✨ امکانات

- 🔍 **جستجوی IP** - بررسی اطلاعات هر آدرس IP (IPv4 و IPv6)
- 🌍 **اطلاعات جغرافیایی** - کشور، شهر، منطقه، کد پستی
- 📍 **موقعیت مکانی** - طول و عرض جغرافیایی
- 🏢 **اطلاعات شبکه** - ISP، سازمان، AS Name
- 🕐 **منطقه زمانی** - تشخیص خودکار timezone
- 🚀 **API سریع** - پاسخ JSON با HTTPS
- 🎨 **طراحی مدرن** - تم تیره با رنگ سبز
- 📱 **واکنش‌گرا** - سازگار با موبایل و دسکتاپ
- 🔒 **امنیت بالا** - Rate Limiting و Security Headers
- 🌙 **PWA** - قابل نصب روی موبایل
- ☁️ **Cloudflare Ready** - آماده استفاده پشت Cloudflare

</div>

---

## 📸 تصویر

<p align="center">
  <img src="screenshots/home.png" alt="صفحه اصلی RezvanGate" width="90%">
</p>

---

<div dir="rtl">

## 📋 پیش‌نیازها

قبل از شروع، مطمئن شوید این موارد را دارید:

</div>

| نرم‌افزار | نسخه | توضیحات |
|-----------|------|---------|
| Node.js | 18+ | [دانلود](https://nodejs.org) |
| npm | 9+ | همراه Node.js نصب می‌شود |
| Git | 2+ | برای clone کردن پروژه |
| Nginx | 1.18+ | فقط برای production |

<div dir="rtl">

### بررسی نصب بودن پیش‌نیازها:

</div>

```bash
node --version    # باید v18 یا بالاتر باشد
npm --version     # باید v9 یا بالاتر باشد
git --version     # باید نصب باشد
```

---

<div dir="rtl">

## 🚀 نصب سریع (توسعه)

این روش برای تست و توسعه در کامپیوتر شخصی است.

</div>

### قدم ۱: کلون کردن پروژه

```bash
git clone https://github.com/Noirc0re/api-isp-org.git
cd api-isp-org
```

### قدم ۲: نصب وابستگی‌ها

```bash
npm install
```

### قدم ۳: دانلود دیتابیس GeoIP

<div dir="rtl">

برای کار کردن API به دیتابیس‌های MaxMind GeoLite2 نیاز دارید.

📖 **[راهنمای کامل نصب دیتابیس](DATABASE_SETUP.md)**

یا به صورت خلاصه:

</div>

1. Create account at [MaxMind](https://www.maxmind.com/en/geolite2/signup)
2. Generate a License Key
3. Download databases to `data/` folder:
   - `GeoLite2-Country.mmdb`
   - `GeoLite2-City.mmdb`
   - `GeoLite2-ASN.mmdb`

### قدم ۴: اجرای سرور توسعه

<div dir="rtl">

در **دو ترمینال جداگانه** اجرا کنید:

</div>

**ترمینال ۱ - Frontend:**
```bash
npm run dev
```

**ترمینال ۲ - Backend API:**
```bash
npm run server
```

<div dir="rtl">

حالا مرورگر را باز کنید و به آدرس زیر بروید:

</div>

```
http://localhost:5173
```

---

<div dir="rtl">

## 🖥️ نصب روی سرور (Production)

این آموزش برای سرور Ubuntu/Debian است.

</div>

### قدم ۱: آپدیت سیستم و نصب پیش‌نیازها

```bash
# آپدیت سیستم
sudo apt update && sudo apt upgrade -y

# نصب Git
sudo apt install git -y

# نصب Node.js 20 (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# بررسی نصب
node --version
npm --version
```

### قدم ۲: کلون کردن پروژه

```bash
# رفتن به پوشه home
cd ~

# کلون کردن
git clone https://github.com/Noirc0re/api-isp-org.git
cd api-isp-org

# نصب وابستگی‌ها
npm install
```

### قدم ۳: دانلود دیتابیس GeoIP

<div dir="rtl">

📖 **[راهنمای کامل نصب دیتابیس](DATABASE_SETUP.md)**

</div>

```bash
# Create data directory
mkdir -p data

# Download databases (replace YOUR_ACCOUNT_ID and YOUR_LICENSE_KEY)
# See DATABASE_SETUP.md for detailed instructions
```

### قدم ۴: ساخت نسخه Production

```bash
npm run build
```

<div dir="rtl">

این دستور پوشه `dist` را می‌سازد که شامل فایل‌های بهینه‌شده است.

</div>

### قدم ۵: نصب PM2 (مدیریت پروسه)

```bash
# نصب PM2 به صورت global
npm install -g pm2

# اجرای Backend با PM2
pm2 start server/index.js --name "api-backend"

# ذخیره تنظیمات برای راه‌اندازی خودکار
pm2 save
pm2 startup
```

<div dir="rtl">

بعد از اجرای `pm2 startup`، یک دستور نمایش داده می‌شود. آن را کپی و اجرا کنید.

</div>

### قدم ۶: بررسی اجرای Backend

```bash
# بررسی وضعیت
pm2 status

# بررسی لاگ‌ها
pm2 logs api-backend

# تست API
curl http://localhost:3001/health
```

<div dir="rtl">

باید خروجی زیر را ببینید:

</div>

```json
{"status":"ok","timestamp":"2025-12-19T22:00:00.000Z"}
```

---

<div dir="rtl">

## 🔧 تنظیم Nginx

</div>

### قدم ۱: نصب Nginx

```bash
sudo apt install nginx -y
```

### قدم ۲: کپی فایل‌های Frontend

```bash
# کپی فایل‌های build شده
sudo cp -r ~/api-isp-org/dist/* /var/www/html/

# کپی فایل‌های public (PWA, icons)
sudo cp -r ~/api-isp-org/public/* /var/www/html/
```

### قدم ۳: تنظیم کانفیگ Nginx

```bash
sudo nano /etc/nginx/sites-available/default
```

<div dir="rtl">

**تمام محتوای فایل را پاک کنید** و این را جایگزین کنید:

</div>

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html;

    server_name _;

    # Frontend - React SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api/ {
        rewrite ^/api/(.*)$ /$1 break;
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### قدم ۴: تست و اعمال تنظیمات

```bash
# تست کانفیگ
sudo nginx -t

# اگر OK بود، ری‌استارت کنید
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### قدم ۵: تست نهایی

```bash
# تست Frontend
curl http://localhost/

# تست API
curl http://localhost/api/health
curl http://localhost/api/ip/8.8.8.8
```

---

<div dir="rtl">

## ☁️ تنظیم Cloudflare (اختیاری)

اگر می‌خواهید از Cloudflare برای SSL/HTTPS استفاده کنید:

</div>

### قدم ۱: تنظیمات Cloudflare

<div dir="rtl">

1. وارد داشبورد Cloudflare شوید
2. دامنه خود را اضافه کنید
3. به **SSL/TLS → Overview** بروید
4. حالت **Full** یا **Full (Strict)** را انتخاب کنید
5. به **SSL/TLS → Edge Certificates** بروید
6. **Always Use HTTPS** را فعال کنید

</div>

### قدم ۲: کانفیگ Nginx برای Cloudflare

<div dir="rtl">

فایل کانفیگ Nginx را ویرایش کنید:

</div>

```bash
sudo nano /etc/nginx/sites-available/default
```

<div dir="rtl">

این کانفیگ کامل را جایگزین کنید:

</div>

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html;

    server_name _;

    # Trust Cloudflare proxy - IPv4
    set_real_ip_from 103.21.244.0/22;
    set_real_ip_from 103.22.200.0/22;
    set_real_ip_from 103.31.4.0/22;
    set_real_ip_from 104.16.0.0/13;
    set_real_ip_from 104.24.0.0/14;
    set_real_ip_from 108.162.192.0/18;
    set_real_ip_from 131.0.72.0/22;
    set_real_ip_from 141.101.64.0/18;
    set_real_ip_from 162.158.0.0/15;
    set_real_ip_from 172.64.0.0/13;
    set_real_ip_from 173.245.48.0/20;
    set_real_ip_from 188.114.96.0/20;
    set_real_ip_from 190.93.240.0/20;
    set_real_ip_from 197.234.240.0/22;
    set_real_ip_from 198.41.128.0/17;
    
    # Trust Cloudflare proxy - IPv6
    set_real_ip_from 2400:cb00::/32;
    set_real_ip_from 2606:4700::/32;
    set_real_ip_from 2803:f800::/32;
    set_real_ip_from 2405:b500::/32;
    set_real_ip_from 2405:8100::/32;
    set_real_ip_from 2a06:98c0::/29;
    set_real_ip_from 2c0f:f248::/32;
    
    real_ip_header CF-Connecting-IP;
    real_ip_recursive on;

    # Frontend - React SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api/ {
        rewrite ^/api/(.*)$ /$1 break;
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header CF-Connecting-IP $http_cf_connecting_ip;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# تست و اعمال
sudo nginx -t && sudo systemctl reload nginx
```

---

<div dir="rtl">

## 📡 API Documentation

</div>

### Endpoints

| Method | Endpoint | توضیحات |
|--------|----------|---------|
| `GET` | `/api/ip` | دریافت اطلاعات IP کاربر فعلی |
| `GET` | `/api/ip/:ip` | دریافت اطلاعات یک IP خاص |
| `GET` | `/api/health` | بررسی سلامت سرور |

### نمونه درخواست

```bash
# IP کاربر فعلی
curl https://your-domain.com/api/ip

# IP خاص
curl https://your-domain.com/api/ip/8.8.8.8

# Health Check
curl https://your-domain.com/api/health
```

### نمونه پاسخ

```json
{
  "ip": "8.8.8.8",
  "ipType": "IPv4",
  "country": "United States",
  "countryCode": "US",
  "region": "California",
  "regionCode": "CA",
  "city": "Mountain View",
  "postalCode": "94039",
  "latitude": 37.386,
  "longitude": -122.083,
  "timezone": "America/Los_Angeles",
  "isp": "Google LLC",
  "organization": "Google LLC",
  "asName": "AS15169 Google LLC",
  "ipv4": "8.8.8.8"
}
```

### فیلدهای پاسخ

| فیلد | نوع | توضیحات |
|------|-----|---------|
| `ip` | string | آدرس IP |
| `ipType` | string | نوع IP (`IPv4` یا `IPv6`) |
| `country` | string | نام کشور |
| `countryCode` | string | کد کشور (ISO 3166-1) |
| `region` | string | نام استان/ایالت |
| `regionCode` | string | کد استان |
| `city` | string | نام شهر |
| `postalCode` | string | کد پستی |
| `latitude` | number | عرض جغرافیایی |
| `longitude` | number | طول جغرافیایی |
| `timezone` | string | منطقه زمانی |
| `isp` | string | ارائه‌دهنده اینترنت |
| `organization` | string | سازمان |
| `asName` | string | شماره و نام AS |
| `ipv4` | string | آدرس IPv4 (اگر موجود) |
| `ipv6` | string | آدرس IPv6 (اگر موجود) |

---

<div dir="rtl">

## 📁 ساختار پروژه

</div>

```
api-isp-org/
├── src/
│   ├── App.jsx          # کامپوننت اصلی React
│   ├── App.css          # استایل‌های اپلیکیشن
│   ├── index.css        # استایل‌های پایه
│   └── main.jsx         # نقطه ورود React
├── server/
│   └── index.js         # سرور API (Express)
├── public/
│   ├── manifest.json    # تنظیمات PWA
│   ├── sw.js            # Service Worker
│   ├── robots.txt       # تنظیمات ربات‌ها
│   └── icons/           # آیکون‌های PWA
├── dist/                # فایل‌های build شده (بعد از npm run build)
├── index.html           # فایل HTML اصلی
├── package.json         # وابستگی‌ها و اسکریپت‌ها
├── vite.config.js       # تنظیمات Vite
├── eslint.config.js     # تنظیمات ESLint
└── README.md            # این فایل
```

---

<div dir="rtl">

## 🔒 امنیت

</div>

| ویژگی | توضیحات |
|-------|---------|
| ✅ Rate Limiting | 100 درخواست در دقیقه برای هر IP |
| ✅ Security Headers | CSP, X-Frame-Options, X-XSS-Protection |
| ✅ Input Validation | اعتبارسنجی فرمت IP |
| ✅ CORS | محدودسازی دسترسی cross-origin |
| ✅ Payload Limit | محدودیت 10KB برای request body |
| ✅ HTTPS Ready | آماده استفاده با SSL/TLS |

---

<div dir="rtl">

## 🔧 دستورات مفید

</div>

### PM2

```bash
# وضعیت سرویس‌ها
pm2 status

# مشاهده لاگ‌ها
pm2 logs api-backend

# ری‌استارت
pm2 restart api-backend

# توقف
pm2 stop api-backend

# حذف
pm2 delete api-backend

# ذخیره تنظیمات
pm2 save
```

### Nginx

```bash
# تست کانفیگ
sudo nginx -t

# ری‌استارت
sudo systemctl restart nginx

# بارگذاری مجدد (بدون قطعی)
sudo systemctl reload nginx

# وضعیت
sudo systemctl status nginx

# مشاهده لاگ خطا
sudo tail -f /var/log/nginx/error.log

# مشاهده لاگ دسترسی
sudo tail -f /var/log/nginx/access.log
```

### بروزرسانی پروژه

```bash
cd ~/api-isp-org

# دریافت آخرین تغییرات
git pull

# نصب وابستگی‌های جدید
npm install

# ساخت مجدد
npm run build

# کپی به nginx
sudo cp -r dist/* /var/www/html/
sudo cp -r public/* /var/www/html/

# ری‌استارت backend
pm2 restart api-backend
```

---

<div dir="rtl">

## ❓ رفع مشکلات

</div>

### مشکل: API کار نمی‌کند

```bash
# بررسی اجرای backend
pm2 status

# اگر stopped بود:
pm2 start server/index.js --name "api-backend"

# بررسی لاگ خطا
pm2 logs api-backend --err
```

### مشکل: سایت باز نمی‌شود

```bash
# بررسی nginx
sudo systemctl status nginx

# اگر خطا داشت:
sudo nginx -t
sudo systemctl restart nginx
```

### مشکل: Invalid Query در API

<div dir="rtl">

این خطا معمولاً به دلیل IP نامعتبر است. اگر پشت Cloudflare هستید:

</div>

1. مطمئن شوید کانفیگ Cloudflare در nginx اضافه شده
2. `sudo nginx -t && sudo systemctl reload nginx`

### مشکل: پورت 80 اشغال است

```bash
# پیدا کردن پروسه روی پورت 80
sudo lsof -i :80

# متوقف کردن
sudo fuser -k 80/tcp

# راه‌اندازی nginx
sudo systemctl start nginx
```

---

<div dir="rtl">

## 🛠️ تکنولوژی‌ها

</div>

| تکنولوژی | نسخه | کاربرد |
|----------|------|--------|
| React | 19 | Frontend UI |
| Vite | 7 | Build Tool |
| Express | 5 | Backend API |
| Node.js | 18+ | Runtime |
| Nginx | 1.18+ | Web Server |
| PM2 | 5+ | Process Manager |
| ipwho.is | - | IP Geolocation API |

---

<div dir="rtl">

## 🤝 مشارکت

از مشارکت شما استقبال می‌کنیم!

1. پروژه را Fork کنید
2. یک Branch جدید بسازید (`git checkout -b feature/amazing-feature`)
3. تغییرات را Commit کنید (`git commit -m 'Add amazing feature'`)
4. به Branch خود Push کنید (`git push origin feature/amazing-feature`)
5. یک Pull Request باز کنید

</div>

---

<div dir="rtl">

## 📄 لایسنس

این پروژه تحت لایسنس MIT منتشر شده است. برای اطلاعات بیشتر فایل [LICENSE](LICENSE) را ببینید.

</div>

---

<p align="center">
  ساخته شده با ❤️ توسط RezvanGate Team
</p>
