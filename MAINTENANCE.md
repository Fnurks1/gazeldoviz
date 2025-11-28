# Bakım ve Kullanım Rehberi - Gazel Döviz

Bu doküman, Gazel Döviz projesinin günlük bakımı, güncelleme ve yönetimi için gerekli bilgileri içerir.

## 📋 İçindekiler

1. [API Anahtarı Yönetimi](#api-anahtarı-yönetimi)
2. [Cache Ayarları](#cache-ayarları)
3. [Log ve Monitoring](#log-ve-monitoring)
4. [Güncelleme İşlemleri](#güncelleme-işlemleri)
5. [Sorun Giderme](#sorun-giderme)
6. [Performans Optimizasyonu](#performans-optimizasyonu)

---

## 🔑 API Anahtarı Yönetimi

### API Anahtarı Ekleme/Değiştirme

#### 1. Local Development

`.env.local` dosyasını düzenleyin:

```bash
# .env.local dosyasını oluşturun veya düzenleyin
cp .env.example .env.local
nano .env.local
```

Gerekli anahtarları ekleyin:

```env
EXCHANGE_RATE_API_KEY=your_new_api_key_here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key
```

Geliştirme sunucusunu yeniden başlatın:

```bash
npm run dev
```

#### 2. Production (Vercel)

1. Vercel Dashboard'a gidin
2. Project Settings > Environment Variables
3. `EXCHANGE_RATE_API_KEY` değişkenini bulun
4. "Edit" tıklayın ve yeni değeri girin
5. "Save" tıklayın
6. **Önemli:** Redeploy yapın (Settings > Deployments > Redeploy)

#### 3. API Anahtarı Test Etme

```bash
# Local test
curl "http://localhost:3000/api/rates?base=USD"

# Production test
curl "https://yourdomain.com/api/rates?base=USD"
```

Başarılı yanıt:
```json
{
  "success": true,
  "base": "USD",
  "rates": [...]
}
```

### API Limitleri ve Kullanım

#### ExchangeRate-API Limitleri

**Free Plan:**
- 1,500 istek/ay
- Dakika başı limit yok
- Temel para birimleri

**Kullanımı Kontrol Etme:**
```bash
# Dashboard: https://app.exchangerate-api.com/dashboard
```

#### Limit Aşımında Yapılacaklar

1. **Kısa Vadeli Çözüm:**
   ```javascript
   // src/lib/cache.ts - Cache süresini artırın
   export const DEFAULT_CACHE_CONFIG = {
     staleTime: 60 * 60 * 1000, // 1 saat (5 dakika yerine)
     cacheTime: 24 * 60 * 60 * 1000, // 24 saat
   };
   ```

2. **Uzun Vadeli Çözüm:**
   - Ücretli plana geçin (50,000 istek/ay)
   - Alternatif API kullanın (Fixer.io, CurrencyLayer)

---

## ⚡ Cache Ayarları

### Cache Sürelerini Değiştirme

#### 1. API Route Cache (Server-Side)

`src/app/api/rates/route.ts`:

```typescript
const response = await fetch(apiUrl, {
  next: { 
    revalidate: 300 // 5 dakika -> istediğiniz süreye değiştirin (saniye)
  }
});
```

Önerilen değerler:
- **Yoğun trafik:** 600 (10 dakika)
- **Normal trafik:** 300 (5 dakika)
- **Az trafik:** 900 (15 dakika)

#### 2. Client-Side Cache (React Query)

`src/lib/cache.ts`:

```typescript
export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  staleTime: 5 * 60 * 1000,      // Veri taze kalma süresi
  cacheTime: 30 * 60 * 1000,     // Cache'de tutma süresi
  refetchInterval: 5 * 60 * 1000, // Otomatik yenileme
};
```

#### 3. Environment Variable ile Cache Kontrolü

`.env.local` veya Vercel environment variables:

```env
# Dakika cinsinden
CACHE_REVALIDATE_TIME=5
API_CACHE_TIME=30
```

Kullanımı:

```typescript
const cacheTime = parseInt(process.env.CACHE_REVALIDATE_TIME || '5') * 60;
```

### Cache Temizleme

#### Manual Cache Clear

```bash
# Local development
rm -rf .next/cache

# Vercel
# Dashboard > Settings > Clear Cache
```

#### Programmatic Cache Clear

```typescript
// Cache API kullanarak
if ('caches' in window) {
  caches.keys().then((names) => {
    names.forEach((name) => {
      caches.delete(name);
    });
  });
}
```

---

## 📊 Log ve Monitoring

### 1. Sentry - Error Tracking

#### Kurulum

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

#### Konfigürasyon

`.env.local`:
```env
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_AUTH_TOKEN=your_token
```

#### Hataları Görüntüleme

1. [Sentry Dashboard](https://sentry.io)
2. Projects > Gazel Döviz
3. Issues sekmesinde tüm hataları görebilirsiniz

#### Custom Error Logging

```typescript
import * as Sentry from '@sentry/nextjs';

try {
  // Kod
} catch (error) {
  Sentry.captureException(error);
  console.error('Error:', error);
}
```

### 2. Vercel Analytics

Otomatik olarak aktif. Görüntüleme:

1. Vercel Dashboard > Project
2. Analytics sekmesi
3. Metrikleri inceleyin:
   - Page views
   - Unique visitors
   - Web Vitals (LCP, FID, CLS)
   - Top pages

### 3. Server Logs

#### Local Development

Loglar otomatik olarak terminalde görünür:

```bash
npm run dev
# API istekleri, hatalar vb. burada görünür
```

#### Production (Vercel)

```bash
# Vercel CLI ile
vercel logs

# Veya Dashboard > Deployments > View Function Logs
```

### 4. API Usage Monitoring

Custom middleware ile API kullanımı takibi:

```typescript
// src/middleware.ts
export function middleware(request: NextRequest) {
  console.log(`API Request: ${request.url} - ${new Date().toISOString()}`);
  return NextResponse.next();
}
```

---

## 🔄 Güncelleme İşlemleri

### 1. Bağımlılık Güncellemeleri

#### Güvenli Güncelleme

```bash
# Mevcut versiyonları kontrol et
npm outdated

# Minor/patch güncellemeleri (güvenli)
npm update

# Major güncellemeler (dikkatli)
npm install next@latest react@latest react-dom@latest
```

#### Güncelleme Sonrası Kontroller

```bash
# Build test
npm run build

# Type check
npm run type-check

# Testleri çalıştır
npm run test

# Local test
npm run dev
```

### 2. Next.js Güncelleme

```bash
# Next.js'i güncelle
npm install next@latest

# Codemods çalıştır (breaking changes varsa)
npx @next/codemod <transform> <path>
```

[Next.js Upgrade Guide](https://nextjs.org/docs/upgrading)

### 3. İçerik Güncellemeleri

#### İş Yeri Bilgilerini Güncelleme

`.env.local` veya Vercel Environment Variables:

```env
NEXT_PUBLIC_BUSINESS_NAME="Yeni İsim"
NEXT_PUBLIC_BUSINESS_ADDRESS="Yeni Adres"
NEXT_PUBLIC_BUSINESS_PHONE="+90 XXX XXX XX XX"
```

Değişiklikten sonra redeploy edin.

---

## 🐛 Sorun Giderme

### Sık Karşılaşılan Sorunlar

#### 1. API İstekleri Başarısız

**Belirti:** Kurlar yüklenmiyor

**Çözüm:**
```bash
# 1. API anahtarını kontrol et
curl "https://v6.exchangerate-api.com/v6/YOUR_KEY/latest/USD"

# 2. Environment variables kontrol
echo $EXCHANGE_RATE_API_KEY

# 3. Logs kontrol
vercel logs --since 1h
```

#### 2. Build Hatası

**Belirti:** Deploy başarısız

**Çözüm:**
```bash
# Local build test
npm run build

# Node modüllerini temizle
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 3. Yavaş Sayfa Yükleme

**Çözüm:**
- Cache sürelerini artırın
- Image optimization kontrol edin
- Lighthouse raporu çalıştırın
```bash
npm install -g lighthouse
lighthouse https://yourdomain.com --view
```

#### 4. Dark Mode Çalışmıyor

**Çözüm:**
```typescript
// LocalStorage kontrol
localStorage.getItem('gazel-doviz-theme')

// Manual set
localStorage.setItem('gazel-doviz-theme', 'dark')
```

---

## ⚡ Performans Optimizasyonu

### 1. Image Optimization

```typescript
// Next.js Image component kullanın
import Image from 'next/image';

<Image
  src="/logo.png"
  width={100}
  height={100}
  alt="Logo"
  priority // Above the fold images için
/>
```

### 2. Code Splitting

```typescript
// Dynamic import kullanın
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Client-side only
});
```

### 3. Font Optimization

```typescript
// app/layout.tsx - zaten optimize edilmiş
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // FOUT önleme
});
```

### 4. Bundle Size Analizi

```bash
# Bundle analyzer ekle
npm install @next/bundle-analyzer

# Build ve analiz et
ANALYZE=true npm run build
```

`next.config.js`:
```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

---

## 📈 Düzenli Bakım Checklist

### Günlük
- [ ] Error logs kontrol (Sentry)
- [ ] API kullanım durumu
- [ ] Site erişilebilirlik

### Haftalık
- [ ] Analytics raporu inceleme
- [ ] Güvenlik güncellemeleri kontrol
- [ ] Backup kontrol

### Aylık
- [ ] Bağımlılık güncellemeleri
- [ ] Performance audit (Lighthouse)
- [ ] API kullanım limiti kontrolü
- [ ] SSL sertifika kontrolü

### Yıllık
- [ ] Domain yenileme
- [ ] API plan değerlendirmesi
- [ ] Major framework güncellemeleri

---

## 🆘 Acil Durum Prosedürleri

### Site Çöktü

1. **Hızlı Rollback:**
   ```bash
   # Vercel Dashboard
   Deployments > Previous Version > Promote to Production
   ```

2. **Status Page:**
   - [Vercel Status](https://www.vercel-status.com/)
   - [ExchangeRate-API Status](https://status.exchangerate-api.com/)

3. **Manuel Müdahale:**
   ```bash
   # Local'de çalıştır
   npm run dev
   
   # Acil fix yap
   git commit -m "hotfix: Critical issue"
   git push
   ```

### İletişim

**Teknik Destek:**
- Email: dev@gazeldoviz.com
- Telefon: +90 XXX XXX XX XX
- GitHub Issues: github.com/yourusername/gazel-doviz/issues

---

## 📚 Kaynaklar

- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
- [ExchangeRate-API Docs](https://www.exchangerate-api.com/docs)
- [Sentry Docs](https://docs.sentry.io/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
