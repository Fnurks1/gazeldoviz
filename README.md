# 💰 Gazel Döviz - Profesyonel API

Gerçek zamanlı döviz kurları - Çoklu kaynak - Offline desteği

## 🚀 Hızlı Başlangıç

```bash
npm install
npm run dev
```

API: http://localhost:3001/api/rates

## ✨ Özellikler

- ✅ **3+ Gerçek Kaynak**: TCMB, ExchangeRate-API, Fixer.io
- ✅ **Akıllı Fallback**: Bir kaynak çökerse diğerine geç
- ✅ **Offline Desteği**: İnternet yoksa cache'den çalış
- ✅ **Veri Kalite Garantisi**: Her response'da kaynak bilgisi
- ✅ **Rate Limiting**: API abuse koruması

## 📊 Veri Kaynakları

1. **TCMB** - %100 (Resmi)
2. **ExchangeRate-API** - %95 (Doğrulanmış)
3. **Fixer.io** - %90 (Yedek)
4. **Fallback** - %50 (Offline)

## 🧪 Test

```bash
./test-api.sh
```

## 📖 Dokümantasyon

[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

**Durum**: ✅ Çalışıyor | **Versiyon**: 1.0.0
