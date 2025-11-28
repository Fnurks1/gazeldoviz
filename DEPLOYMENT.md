# Deployment Rehberi - Gazel Döviz

Bu doküman, Gazel Döviz projesini farklı platformlara deploy etmek için gerekli adımları içerir.

## 📋 Ön Gereksinimler

- Node.js 18+ kurulu olmalı
- Git kurulu olmalı
- API anahtarları hazır olmalı (ExchangeRate-API, Google Maps)
- Vercel/Netlify/Docker hesabı (deploy platformuna göre)

## 🚀 Vercel ile Deploy (Önerilen)

Vercel, Next.js projeleri için en optimize çözümdür ve sıfır konfigürasyon gerektirir.

### Adım 1: Vercel Hesabı Oluşturma

1. [https://vercel.com](https://vercel.com) adresine gidin
2. GitHub hesabınızla giriş yapın
3. "Import Project" seçeneğini tıklayın

### Adım 2: Projeyi İçe Aktarma

```bash
# GitHub'a push edin (henüz yapmadıysanız)
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/gazel-doviz.git
git push -u origin main
```

### Adım 3: Vercel'de Yapılandırma

1. Vercel dashboard'da "New Project" tıklayın
2. GitHub repo'nuzu seçin
3. Framework Preset: **Next.js** (otomatik algılanır)
4. Root Directory: `./`
5. Build Command: `npm run build` (varsayılan)
6. Output Directory: `.next` (varsayılan)

### Adım 4: Environment Variables Ekleme

Vercel dashboard'da Settings > Environment Variables bölümüne gidin:

```env
# API Keys
EXCHANGE_RATE_API_KEY=your_api_key_here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key

# Site Config
NEXT_PUBLIC_SITE_URL=https://yourdomain.vercel.app
NEXT_PUBLIC_SITE_NAME=Gazel Döviz

# Business Info
NEXT_PUBLIC_BUSINESS_NAME=Gazel Döviz
NEXT_PUBLIC_BUSINESS_ADDRESS=Your Address
NEXT_PUBLIC_BUSINESS_PHONE=+90 XXX XXX XX XX
NEXT_PUBLIC_BUSINESS_EMAIL=info@gazeldoviz.com
NEXT_PUBLIC_BUSINESS_LAT=41.0082
NEXT_PUBLIC_BUSINESS_LNG=28.9784
NEXT_PUBLIC_WORKING_HOURS=Pazartesi - Cumartesi: 09:00 - 19:00

# Optional: Monitoring
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_sentry_token
```

### Adım 5: Deploy

"Deploy" butonuna tıklayın. Vercel otomatik olarak:
- Bağımlılıkları yükler
- Projeyi build eder
- CDN'e deploy eder
- SSL sertifikası oluşturur

Deploy tamamlandığında size bir URL verilir (örn: `gazel-doviz.vercel.app`)

### Adım 6: Custom Domain Ekleme (Opsiyonel)

1. Vercel dashboard > Settings > Domains
2. Domain adınızı girin (örn: `gazeldoviz.com`)
3. DNS kayıtlarını domain sağlayıcınızda yapılandırın:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

## 🐳 Docker ile Deploy

### Dockerfile Oluşturma

Proje kök dizinine `Dockerfile` oluşturun:

```dockerfile
# Multi-stage build
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose (Opsiyonel)

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - EXCHANGE_RATE_API_KEY=${EXCHANGE_RATE_API_KEY}
      - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      - NEXT_PUBLIC_SITE_URL=https://gazeldoviz.com
    restart: unless-stopped
```

### Build ve Run

```bash
# Image oluştur
docker build -t gazel-doviz .

# Container çalıştır
docker run -p 3000:3000 \
  -e EXCHANGE_RATE_API_KEY=your_key \
  -e NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key \
  gazel-doviz

# Docker Compose ile
docker-compose up -d
```

## 🌐 Netlify ile Deploy

### netlify.toml Oluşturma

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Deploy Adımları

1. [Netlify](https://netlify.com) hesabı oluşturun
2. "New site from Git" seçin
3. GitHub repo'nuzu bağlayın
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Environment variables ekleyin
6. Deploy edin

## 🔧 CI/CD ile Otomatik Deploy

GitHub Actions workflow'u (`.github/workflows/ci-cd.yml`) zaten yapılandırılmış durumda.

### GitHub Secrets Ekleme

Repository > Settings > Secrets and variables > Actions:

```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
EXCHANGE_RATE_API_KEY=your_api_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key
SENTRY_AUTH_TOKEN=your_sentry_token
SENTRY_ORG=your_org
SENTRY_PROJECT=your_project
```

Her `main` branch'e push'ta otomatik deploy gerçekleşir.

## 📊 Deploy Sonrası

### 1. DNS Propagation Kontrolü

```bash
# DNS kontrolü
nslookup gazeldoviz.com
dig gazeldoviz.com
```

### 2. SSL Sertifika Kontrolü

```bash
# SSL test
curl -I https://gazeldoviz.com
openssl s_client -connect gazeldoviz.com:443
```

### 3. Performance Test

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

### 4. SEO Kontrolü

- [Google Search Console](https://search.google.com/search-console)
- sitemap.xml ekleyin (`/sitemap.xml`)
- robots.txt yapılandırın

## 🐛 Troubleshooting

### Build Hataları

```bash
# Cache temizle
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Çalışmıyor

- `NEXT_PUBLIC_` prefix'i client-side değişkenler için gerekli
- Vercel'de değişken ekledikten sonra redeploy edin
- `.env.local` dosyası production'da kullanılmaz

### API Rate Limiting

- ExchangeRate-API free tier: 1,500 istek/ay
- Upgrade yapın veya caching süresini artırın
- `CACHE_REVALIDATE_TIME` env variable ile ayarlayın

## 📈 Monitoring

### Vercel Analytics

Otomatik olarak etkin. Dashboard'da metrikleri görüntüleyin:
- Page views
- Unique visitors
- Top pages
- Web Vitals

### Sentry Error Tracking

1. [Sentry.io](https://sentry.io) hesabı oluşturun
2. Yeni proje oluşturun (Next.js)
3. DSN'yi environment variables'a ekleyin
4. Otomatik error tracking başlar

## 🔄 Güncelleme ve Rollback

### Yeni Versiyon Deploy

```bash
git add .
git commit -m "feat: New feature"
git push origin main
```

Vercel otomatik deploy eder.

### Rollback

1. Vercel Dashboard > Deployments
2. Önceki deployment'ı seçin
3. "Promote to Production" tıklayın

## 📝 Checklist

Deploy öncesi kontrol listesi:

- [ ] Tüm environment variables ayarlandı
- [ ] API anahtarları test edildi
- [ ] Build local'de başarılı
- [ ] Tests geçti
- [ ] SEO meta tags eklendi
- [ ] Analytics kuruldu
- [ ] Error monitoring aktif
- [ ] SSL sertifikası geçerli
- [ ] Custom domain ayarlandı (varsa)
- [ ] robots.txt ve sitemap.xml eklendi
- [ ] Performance optimizasyonları yapıldı

## 🆘 Destek

Sorun yaşarsanız:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- GitHub Issues açın
- info@gazeldoviz.com ile iletişime geçin
