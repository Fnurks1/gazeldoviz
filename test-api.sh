#!/bin/bash

# Gazel Döviz - API Test Script
# Bu script API'nin düzgün çalıştığını test eder

echo "🧪 Gazel Döviz API Test Başlıyor..."
echo "=================================="
echo ""

API_URL="http://localhost:3001"

# Renkler
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: API Health Check
echo "📊 Test 1: API Health Check"
response=$(curl -s -w "%{http_code}" -o /tmp/api_test.json "${API_URL}/api/rates")
http_code="${response: -3}"

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✅ API çalışıyor (HTTP $http_code)${NC}"
else
    echo -e "${RED}❌ API çalışmıyor (HTTP $http_code)${NC}"
    exit 1
fi
echo ""

# Test 2: Data Quality Check
echo "📊 Test 2: Data Quality Check"
source=$(cat /tmp/api_test.json | grep -o '"source":"[^"]*"' | cut -d'"' -f4)
dataQuality=$(cat /tmp/api_test.json | grep -o '"dataQuality":"[^"]*"' | cut -d'"' -f4)
reliability=$(cat /tmp/api_test.json | grep -o '"reliability":"[^"]*"' | cut -d'"' -f4)

echo "📡 Kaynak: $source"
echo "💎 Kalite: $dataQuality"
echo "🎯 Güvenilirlik: $reliability"

if [ "$dataQuality" == "OFFICIAL" ]; then
    echo -e "${GREEN}✅ Resmi kaynak kullanılıyor (TCMB)${NC}"
elif [ "$dataQuality" == "VERIFIED" ]; then
    echo -e "${YELLOW}⚠️  Doğrulanmış kaynak kullanılıyor${NC}"
else
    echo -e "${RED}⚠️  Fallback veri kullanılıyor${NC}"
fi
echo ""

# Test 3: USD Rate Check
echo "📊 Test 3: USD Kuru Kontrolü"
usd_rate=$(cat /tmp/api_test.json | grep -o '"code":"USD".*?"rate":[0-9.]*' | grep -o '[0-9.]*$')

if [ ! -z "$usd_rate" ]; then
    echo -e "${GREEN}✅ USD kuru bulundu: $usd_rate TRY${NC}"
    
    # Gerçekçi mi kontrol et (20-50 TRY arası)
    if (( $(echo "$usd_rate > 20" | bc -l) )) && (( $(echo "$usd_rate < 50" | bc -l) )); then
        echo -e "${GREEN}✅ USD kuru gerçekçi aralıkta (20-50 TRY)${NC}"
    else
        echo -e "${YELLOW}⚠️  USD kuru beklenmedik: $usd_rate TRY${NC}"
    fi
else
    echo -e "${RED}❌ USD kuru bulunamadı${NC}"
fi
echo ""

# Test 4: Total Currencies
echo "📊 Test 4: Para Birimi Sayısı"
total=$(cat /tmp/api_test.json | grep -o '"totalCurrencies":[0-9]*' | grep -o '[0-9]*$')

if [ ! -z "$total" ] && [ "$total" -gt 5 ]; then
    echo -e "${GREEN}✅ Toplam $total para birimi bulundu${NC}"
else
    echo -e "${RED}❌ Yeterli para birimi bulunamadı (Toplam: $total)${NC}"
fi
echo ""

# Test 5: Conversion Test
echo "📊 Test 5: Döviz Çevirme Testi"
conversion=$(curl -s -X POST "${API_URL}/api/rates" \
    -H "Content-Type: application/json" \
    -d '{"from":"USD","to":"TRY","amount":100}')

result=$(echo "$conversion" | grep -o '"result":[0-9.]*' | grep -o '[0-9.]*$')

if [ ! -z "$result" ]; then
    echo -e "${GREEN}✅ Çevirme başarılı: 100 USD = $result TRY${NC}"
else
    echo -e "${RED}❌ Çevirme başarısız${NC}"
fi
echo ""

# Test 6: Rate Limiting Test
echo "📊 Test 6: Rate Limiting Testi"
echo "⏳ 65 istek gönderiliyor..."

success_count=0
rate_limited=0

for i in {1..65}; do
    response=$(curl -s -w "%{http_code}" -o /dev/null "${API_URL}/api/rates")
    if [ "$response" == "200" ]; then
        ((success_count++))
    elif [ "$response" == "429" ]; then
        ((rate_limited++))
    fi
done

echo "✅ Başarılı: $success_count"
echo "🚫 Rate Limited: $rate_limited"

if [ "$rate_limited" -gt 0 ]; then
    echo -e "${GREEN}✅ Rate limiting çalışıyor${NC}"
else
    echo -e "${YELLOW}⚠️  Rate limiting aktif değil veya limit yüksek${NC}"
fi
echo ""

# Test 7: Response Time Test
echo "📊 Test 7: Response Time Testi"
start=$(date +%s%N)
curl -s "${API_URL}/api/rates" > /dev/null
end=$(date +%s%N)

duration=$(( ($end - $start) / 1000000 ))
echo "⏱️  Response time: ${duration}ms"

if [ "$duration" -lt 500 ]; then
    echo -e "${GREEN}✅ Response time hızlı (<500ms)${NC}"
elif [ "$duration" -lt 2000 ]; then
    echo -e "${YELLOW}⚠️  Response time normal (500-2000ms)${NC}"
else
    echo -e "${RED}⚠️  Response time yavaş (>2000ms)${NC}"
fi
echo ""

# Test 8: CORS Test
echo "📊 Test 8: CORS Kontrolü"
cors=$(curl -s -X OPTIONS "${API_URL}/api/rates" -H "Origin: http://example.com" -I | grep -i "access-control-allow")

if [ ! -z "$cors" ]; then
    echo -e "${GREEN}✅ CORS headers mevcut${NC}"
else
    echo -e "${RED}❌ CORS headers bulunamadı${NC}"
fi
echo ""

# Özet
echo "=================================="
echo "🎉 Test Tamamlandı!"
echo ""
echo "📋 Özet:"
echo "  • API Durumu: ✅ Çalışıyor"
echo "  • Veri Kaynağı: $source"
echo "  • Veri Kalitesi: $dataQuality ($reliability)"
echo "  • USD Kuru: $usd_rate TRY"
echo "  • Toplam Para Birimi: $total"
echo "  • Response Time: ${duration}ms"
echo ""
echo "🔗 API Endpoint: ${API_URL}/api/rates"
echo "📖 Dokümantasyon: API_DOCUMENTATION.md"
echo ""

# Cleanup
rm -f /tmp/api_test.json

exit 0
