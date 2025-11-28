"""
Gelişmiş Dolar Kurları Scraper - Doğrudan API Erişimi
anlikaltinfiyatlari.com'un kendi API'lerini kullanır
"""
import aiohttp
from bs4 import BeautifulSoup
from datetime import datetime
from typing import Dict, List, Optional
import asyncio
import json


class DolarScraperPro:
    """
    Dolar kurlarını çeker - Çift kaynaklı:
    1. Doğrudan API (/socket/total.php) - SÜPER HIZLI
    2. Web scraping (yedek)
    """
    
    def __init__(self):
        # API Endpoint'leri
        self.api_url = "https://anlikaltinfiyatlari.com/socket/total.php"
        self.page_url = "https://anlikaltinfiyatlari.com/doviz/dolar"
        
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://anlikaltinfiyatlari.com/doviz/dolar',
            'Accept': 'application/json, text/plain, */*'
        }
        
        self._cache = None
        self._last_update = None
        self._api_available = True
    
    async def fetch_from_api(self) -> Optional[Dict]:
        """Doğrudan API'den veri çeker - EN HIZLI YOL"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(self.api_url, headers=self.headers, timeout=5) as response:
                    if response.status == 200:
                        text = await response.text()
                        import json
                        data = json.loads(text)
                        return self._transform_api_data(data)
        except Exception as e:
            print(f"API hatası: {e}")
            self._api_available = False
        return None
    
    def _transform_api_data(self, raw_data: Dict) -> Dict:
        """API verisini standart formata dönüştürür"""
        
        # Gram altın hesapla (ONS * DOLAR / 31.1)
        xauusd = raw_data.get('XAUUSD', 0)
        usdtry = raw_data.get('USDTRY', 0)
        gram_altin = round(xauusd * usdtry / 31.1, 2) if xauusd and usdtry else 0
        
        return {
            "timestamp": datetime.now().isoformat(),
            "source": "anlikaltinfiyatlari.com (Direct API)",
            "api_time": raw_data.get('T', ''),
            "general": {
                "dolar": {
                    "name": "Dolar/TL",
                    "code": "USD",
                    "value": raw_data.get('USDTRY'),
                    "source_time": raw_data.get('T')
                }
            },
            "currencies": {
                "USDTRY": {
                    "name": "Dolar/TL",
                    "value": raw_data.get('USDTRY')
                },
                "EURTRY": {
                    "name": "Euro/TL", 
                    "value": raw_data.get('EURTRY')
                },
                "GBPTRY": {
                    "name": "Sterlin/TL",
                    "value": raw_data.get('GBPTRY')
                },
                "EURUSD": {
                    "name": "Euro/Dolar",
                    "value": raw_data.get('EURUSD')
                },
                "XAUUSD": {
                    "name": "Altın Ons (USD)",
                    "value": raw_data.get('XAUUSD')
                },
                "XAGUSD": {
                    "name": "Gümüş Ons (USD)",
                    "value": raw_data.get('XAGUSD')
                },
                "GRAMTRY": {
                    "name": "Gram Altın (TL)",
                    "value": gram_altin,
                    "calculated": True
                },
                "USDJPY": {
                    "name": "Dolar/Yen",
                    "value": raw_data.get('USDJPY')
                },
                "USDCHF": {
                    "name": "Dolar/Frank",
                    "value": raw_data.get('USDCHF')
                },
                "DXYUSD": {
                    "name": "Dolar Endeksi",
                    "value": raw_data.get('DXYUSD')
                }
            },
            "raw_api_data": raw_data
        }
    
    async def fetch_from_page(self) -> Dict:
        """Web sayfasından veri çeker (yedek yöntem)"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(self.page_url, headers=self.headers, timeout=10) as response:
                    html = await response.text()
                    
            soup = BeautifulSoup(html, 'html.parser')
            
            data = {
                "timestamp": datetime.now().isoformat(),
                "source": "anlikaltinfiyatlari.com (Web Scraping)",
                "general": self._extract_general_rates(soup),
                "banks": self._extract_bank_rates(soup),
                "currencies": self._extract_currencies_from_page(soup)
            }
            
            return data
            
        except Exception as e:
            print(f"Sayfa çekme hatası: {e}")
            return {"error": str(e), "timestamp": datetime.now().isoformat()}
    
    def _extract_general_rates(self, soup: BeautifulSoup) -> Dict:
        """Genel dolar kurlarını çıkarır"""
        try:
            table = soup.find('table', class_='Kur')
            if not table:
                return {}
            
            rows = table.find_all('tr')
            result = {}
            
            for row in rows[1:]:  # Header'ı atla
                cells = row.find_all('td')
                if len(cells) < 5:
                    continue
                
                title = cells[0].get_text(strip=True)
                is_kapali = 'KAPALIÇARŞI' in title.upper()
                
                key = "kapali_carsi" if is_kapali else "serbest_piyasa"
                result[key] = {
                    "name": "Kapalı Çarşı Dolar" if is_kapali else "Serbest Piyasa Dolar",
                    "buy": self._safe_float(cells[1].get_text(strip=True)),
                    "sell": self._safe_float(cells[2].get_text(strip=True)),
                    "change": cells[3].get_text(strip=True) if len(cells) > 3 else None,
                    "change_percent": cells[4].get_text(strip=True) if len(cells) > 4 else None,
                    "time": cells[5].get_text(strip=True) if len(cells) > 5 else None
                }
            
            return result
            
        except Exception as e:
            print(f"Genel kurlar hatası: {e}")
            return {}
    
    def _extract_bank_rates(self, soup: BeautifulSoup) -> List[Dict]:
        """Banka kurlarını çıkarır"""
        try:
            bank_table = soup.find('table', id='banks')
            if not bank_table:
                return []
            
            rows = bank_table.find_all('tr')[1:]  # Header'ı atla
            banks = []
            
            for row in rows:
                cells = row.find_all('td')
                if len(cells) < 5:
                    continue
                
                bank_name_elem = cells[0].find('a')
                bank_name = bank_name_elem.get_text(strip=True) if bank_name_elem else cells[0].get_text(strip=True)
                
                # data attribute'larından al
                bank = {
                    "name": bank_name.replace('Merkez Bankası', 'TCMB'),
                    "code": row.get('data-bankcode', ''),
                    "buy": self._safe_float(row.get('data-alis', cells[1].get_text(strip=True))),
                    "sell": self._safe_float(row.get('data-satis', cells[2].get_text(strip=True))),
                    "margin": f"%{row.get('data-oran', '')}" if row.get('data-oran') else cells[3].get_text(strip=True),
                    "spread": self._safe_float(cells[4].get_text(strip=True)) if len(cells) > 4 else None
                }
                
                # Saat bilgisi
                time_elem = cells[0].find('span', class_='time')
                if time_elem:
                    bank['time'] = time_elem.get_text(strip=True)
                
                banks.append(bank)
            
            return banks
            
        except Exception as e:
            print(f"Banka kurları hatası: {e}")
            return []
    
    def _extract_currencies_from_page(self, soup: BeautifulSoup) -> Dict:
        """Sayfadan diğer döviz kurlarını çıkarır"""
        try:
            currencies = {}
            price_divs = soup.find_all('div', class_='price')
            
            for div in price_divs:
                name_attr = div.get('data-name')
                if name_attr:
                    currencies[name_attr] = {
                        "value": self._safe_float(div.get_text(strip=True))
                    }
            
            return currencies
        except:
            return {}
    
    def _safe_float(self, text) -> Optional[float]:
        """Güvenli float dönüşümü"""
        if text is None:
            return None
        try:
            cleaned = str(text).replace(',', '').replace('%', '').strip()
            return float(cleaned) if cleaned else None
        except:
            return None
    
    async def fetch_all_data(self) -> Dict:
        """
        Tüm verileri çeker - Önce API, sonra sayfa
        API daha hızlı ve güvenilir!
        """
        # Önce hızlı API'yi dene
        if self._api_available:
            api_data = await self.fetch_from_api()
            if api_data:
                # Banka verileri için sayfayı da çek
                page_data = await self.fetch_from_page()
                api_data['banks'] = page_data.get('banks', [])
                api_data['general'].update(page_data.get('general', {}))
                
                self._cache = api_data
                self._last_update = datetime.now()
                return api_data
        
        # API başarısız olursa sayfadan çek
        page_data = await self.fetch_from_page()
        self._cache = page_data
        self._last_update = datetime.now()
        return page_data
    
    async def fetch_quick(self) -> Dict:
        """
        Sadece API'den hızlı veri çeker (banka verileri olmadan)
        SÜPER HIZLI - milisaniyeler içinde yanıt
        """
        api_data = await self.fetch_from_api()
        if api_data:
            self._cache = api_data
            self._last_update = datetime.now()
            return api_data
        
        # Cache varsa döndür
        if self._cache:
            return self._cache
        
        # Son çare: sayfadan çek
        return await self.fetch_from_page()
    
    def get_cached_data(self) -> Optional[Dict]:
        return self._cache
    
    def get_last_update_time(self) -> Optional[datetime]:
        return self._last_update


# Test
async def test():
    scraper = DolarScraperPro()
    
    print("=" * 60)
    print("🚀 HIZLI API TESTİ (Sadece API)")
    print("=" * 60)
    
    import time
    start = time.time()
    data = await scraper.fetch_quick()
    elapsed = time.time() - start
    
    print(f"⏱️ Süre: {elapsed*1000:.0f}ms")
    print(f"📊 Kaynak: {data.get('source')}")
    print(f"⏰ API Saati: {data.get('api_time')}")
    print()
    
    if 'currencies' in data:
        print("💱 Döviz Kurları:")
        for code, info in list(data['currencies'].items())[:5]:
            print(f"   {info['name']}: {info['value']}")
    
    print()
    print("=" * 60)
    print("📋 TAM VERİ TESTİ (API + Banka Verileri)")
    print("=" * 60)
    
    start = time.time()
    full_data = await scraper.fetch_all_data()
    elapsed = time.time() - start
    
    print(f"⏱️ Süre: {elapsed*1000:.0f}ms")
    
    if 'banks' in full_data and full_data['banks']:
        print(f"\n🏦 {len(full_data['banks'])} Banka Kuru:")
        for bank in full_data['banks'][:3]:
            print(f"   {bank['name']}: Alış={bank['buy']} Satış={bank['sell']}")

if __name__ == "__main__":
    asyncio.run(test())
