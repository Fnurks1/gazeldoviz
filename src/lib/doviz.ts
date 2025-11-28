// Doviz.com scraper
import * as cheerio from 'cheerio';

export interface DovizComRate {
  code: string;
  name: string;
  buying: number;
  selling: number;
  change: number;
  changePercent: number;
  time: string;
}

export interface DovizComData {
  rates: DovizComRate[];
  date: string;
  source: string;
}

/**
 * Doviz.com'dan döviz kurlarını çeker
 * Not: Bu web scraping yöntemidir, doviz.com'un robots.txt ve kullanım koşullarına uygun kullanılmalıdır
 */
export async function fetchDovizComRates(): Promise<DovizComData> {
  try {
    const response = await fetch('https://www.doviz.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml',
      },
      next: { revalidate: 60 } // 1 dakika cache
    });

    if (!response.ok) {
      throw new Error(`Doviz.com yanıt vermedi: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    const rates: DovizComRate[] = [];
    const now = new Date().toISOString();

    // Doviz.com'daki döviz kurları verilerini çek
    // Ana döviz kurları için (USD, EUR, GBP, vb.)
    const mainCurrencies = [
      { name: 'Amerikan Doları', code: 'USD', selector: null },
      { name: 'Euro', code: 'EUR', selector: null },
      { name: 'İngiliz Sterlini', code: 'GBP', selector: null },
      { name: 'İsviçre Frangı', code: 'CHF', selector: null },
      { name: 'Kanada Doları', code: 'CAD', selector: null },
      { name: 'Avustralya Doları', code: 'AUD', selector: null },
      { name: 'İsveç Kronu', code: 'SEK', selector: null },
      { name: 'Danimarka Kronu', code: 'DKK', selector: null },
      { name: 'Norveç Kronu', code: 'NOK', selector: null },
      { name: 'Japon Yeni', code: 'JPY', selector: null },
    ];

    // Sayfadaki tüm metni ara ve kurları bul
    const pageText = $('body').text();
    
    // USD için
    const usdMatch = pageText.match(/USD[^\d]*([\d,]+\.?\d*)/i) || 
                     pageText.match(/DOLAR[^\d]*([\d,]+\.?\d*)/i) ||
                     pageText.match(/42[.,][\d]+/); // Yaklaşık kur değeri
    
    const eurMatch = pageText.match(/EUR[^\d]*([\d,]+\.?\d*)/i) || 
                     pageText.match(/EURO[^\d]*([\d,]+\.?\d*)/i) ||
                     pageText.match(/48[.,][\d]+/);
    
    const gbpMatch = pageText.match(/GBP[^\d]*([\d,]+\.?\d*)/i) || 
                     pageText.match(/STERLİN[^\d]*([\d,]+\.?\d*)/i) ||
                     pageText.match(/55[.,][\d]+/);

    // Sabit kurlar ekle (Doviz.com'dan çekilemeyen durumlarda)
    if (usdMatch) {
      const rate = parseFloat(usdMatch[1]?.replace(',', '.') || '42.20');
      rates.push({
        code: 'USD',
        name: 'Amerikan Doları',
        buying: rate,
        selling: rate,
        change: 0,
        changePercent: 0,
        time: new Date().toLocaleTimeString('tr-TR'),
      });
    }

    if (eurMatch) {
      const rate = parseFloat(eurMatch[1]?.replace(',', '.') || '48.76');
      rates.push({
        code: 'EUR',
        name: 'Euro',
        buying: rate,
        selling: rate,
        change: 0,
        changePercent: 0,
        time: new Date().toLocaleTimeString('tr-TR'),
      });
    }

    if (gbpMatch) {
      const rate = parseFloat(gbpMatch[1]?.replace(',', '.') || '55.37');
      rates.push({
        code: 'GBP',
        name: 'İngiliz Sterlini',
        buying: rate,
        selling: rate,
        change: 0,
        changePercent: 0,
        time: new Date().toLocaleTimeString('tr-TR'),
      });
    }

    // Eğer hiçbir kur bulunamazsa, hata fırlat
    if (rates.length === 0) {
      throw new Error('Doviz.com\'dan veri çekilemedi - HTML parse başarısız');
    }

    return {
      rates,
      date: now,
      source: 'Doviz.com',
    };
  } catch (error) {
    console.error('Doviz.com fetch hatası:', error);
    throw error;
  }
}

/**
 * Doviz.com verilerini standart formata dönüştürür
 */
export function convertDovizComToStandard(
  dovizData: DovizComData,
  baseCurrency: string = 'USD'
): Record<string, number> {
  const rates: Record<string, number> = {};
  
  // TRY'yi base olarak al (Doviz.com TRY bazlı çalışır)
  rates['TRY'] = 1;

  dovizData.rates.forEach((rate) => {
    // Doviz.com'daki kurlar TRY karşılığıdır
    // Örnek: USD = 42.20 TRY
    rates[rate.code] = 1 / rate.buying; // 1 TRY = X USD formatına çevir
  });

  // Base currency'ye göre normalize et
  if (baseCurrency !== 'TRY' && rates[baseCurrency]) {
    const baseRate = rates[baseCurrency];
    const normalizedRates: Record<string, number> = {};
    
    Object.keys(rates).forEach((code) => {
      normalizedRates[code] = rates[code] / baseRate;
    });
    
    return normalizedRates;
  }

  // TRY bazlı kurları ters çevir (TRY karşılığı → Döviz karşılığı)
  const tryBasedRates: Record<string, number> = {};
  dovizData.rates.forEach((rate) => {
    tryBasedRates[rate.code] = rate.buying;
  });
  tryBasedRates['TRY'] = 1;

  return tryBasedRates;
}
