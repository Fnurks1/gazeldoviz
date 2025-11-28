# 💰 Anlık Dolar Kuru API v2 ⚡

**anlikaltinfiyatlari.com**'dan anlık döviz kurlarını çeken süper hızlı REST API ve WebSocket servisi.

## 🚀 Özellikler

- ⚡ **Doğrudan API Bağlantısı** - Site'nin kendi API'sine (`/socket/total.php`) direkt erişim
- 🔥 **~250ms Yanıt Süresi** - Süper hızlı veri çekme
- 🔄 **Her 1 Saniye Güncelleme** - WebSocket ile anlık veri
- 🏦 **17 Banka Kuru** - Tüm bankaların dolar kurları
- 📊 **10+ Döviz Kuru** - USD, EUR, GBP, XAU, XAG, JPY, CHF...

## 📦 Kurulum

```bash
# Sanal ortam oluştur
python -m venv .venv

# Aktifleştir (Windows)
.venv\Scripts\activate

# Bağımlılıkları yükle
pip install -r requirements.txt
```

## 🎯 Kullanım

```bash
python api_v2.py
```

API çalışacak: **http://localhost:8000**

## 🔌 API Endpoints

### REST Endpoints

| Endpoint | Açıklama |
|----------|----------|
| `GET /api/quick` | ⚡ En hızlı - Sadece döviz kurları (~250ms) |
| `GET /api/dolar` | Tam veri - Döviz + Banka kurları |
| `GET /api/currencies` | Tüm döviz kurları |
| `GET /api/banks` | 17 banka dolar kuru |
| `GET /api/status` | API durumu |

### WebSocket

```javascript
const ws = new WebSocket('ws://localhost:8000/ws');

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Dolar:', data.data.currencies.USDTRY.value);
};
```

## 📊 Örnek Yanıt

```json
{
  "timestamp": "2025-11-25T16:50:01",
  "api_time": "16:50:01",
  "source": "anlikaltinfiyatlari.com (Direct API)",
  "currencies": {
    "USDTRY": {"name": "Dolar/TL", "value": 42.4326},
    "EURTRY": {"name": "Euro/TL", "value": 49.1061},
    "GBPTRY": {"name": "Sterlin/TL", "value": 55.8093},
    "XAUUSD": {"name": "Altın Ons (USD)", "value": 4149.17},
    "GRAMTRY": {"name": "Gram Altın (TL)", "value": 5661.73},
    "EURUSD": {"name": "Euro/Dolar", "value": 1.1554},
    "DXYUSD": {"name": "Dolar Endeksi", "value": 99.875}
  }
}
```

## 🔄 Güncelleme Sıklığı

| Veri | Güncelleme |
|------|------------|
| Döviz kurları | Her 1 saniye ⚡ |
| Banka kurları | Her 30 saniye |
| WebSocket push | Her 1 saniye |

## 📡 Veri Kaynağı

API, **anlikaltinfiyatlari.com**'un kendi internal API'sine bağlanır:
- `https://anlikaltinfiyatlari.com/socket/total.php` - Ana döviz verileri
- Web scraping - Banka kurları

## 📁 Dosya Yapısı

```
├── api_v2.py              # FastAPI uygulaması
├── dolar_scraper_pro.py   # Veri çekme modülü
├── requirements.txt       # Python bağımlılıkları
└── README.md              # Dokümantasyon
```

## 🛠️ Teknolojiler

- **FastAPI** - Modern web framework
- **Uvicorn** - ASGI server
- **aiohttp** - Async HTTP client
- **BeautifulSoup4** - HTML parsing
- **WebSockets** - Gerçek zamanlı iletişim

## 📝 Lisans

MIT License

## ⚠️ Sorumluluk Reddi

Bu proje eğitim amaçlıdır. Veriler anlikaltinfiyatlari.com'dan alınmaktadır ve yatırım tavsiyesi değildir.
