// TCMB (Türkiye Cumhuriyet Merkez Bankası) Döviz Kuru API
// Kaynak: https://www.tcmb.gov.tr/kurlar/today.xml

export interface TCMBRate {
  code: string;
  name: string;
  forexBuying: number;
  forexSelling: number;
  banknoteBuying: number;
  banknoteSelling: number;
  crossRateUSD?: number;
}

export interface TCMBResponse {
  date: string;
  rates: TCMBRate[];
  success: boolean;
}

/**
 * TCMB XML'inden döviz kurlarını çeker ve parse eder
 */
export async function fetchTCMBRates(): Promise<TCMBResponse> {
  try {
    const response = await fetch('https://www.tcmb.gov.tr/kurlar/today.xml', {
      next: { revalidate: 300 } // 5 dakika cache
    });

    if (!response.ok) {
      throw new Error(`TCMB API error: ${response.status}`);
    }

    const xmlText = await response.text();
    
    // XML'den tarihi çıkar
    const dateMatch = xmlText.match(/Date="([^"]+)"/);
    const date = dateMatch ? dateMatch[1] : new Date().toISOString();

    // Her bir Currency elementini parse et
    const currencyRegex = /<Currency[^>]*CrossOrder="(\d+)"[^>]*Kod="([^"]+)"[^>]*>(.*?)<\/Currency>/gs;
    const rates: TCMBRate[] = [];
    
    let match;
    while ((match = currencyRegex.exec(xmlText)) !== null) {
      const currencyBlock = match[3];
      const code = match[2];
      
      // Her bir değeri çıkar
      const unit = parseFloat(extractTag(currencyBlock, 'Unit') || '1');
      const name = extractTag(currencyBlock, 'CurrencyName') || code;
      const forexBuying = parseFloat(extractTag(currencyBlock, 'ForexBuying') || '0') / unit;
      const forexSelling = parseFloat(extractTag(currencyBlock, 'ForexSelling') || '0') / unit;
      const banknoteBuying = parseFloat(extractTag(currencyBlock, 'BanknoteBuying') || '0') / unit;
      const banknoteSelling = parseFloat(extractTag(currencyBlock, 'BanknoteSelling') || '0') / unit;
      const crossRateUSD = extractTag(currencyBlock, 'CrossRateUSD') 
        ? parseFloat(extractTag(currencyBlock, 'CrossRateUSD')!) 
        : undefined;

      rates.push({
        code,
        name,
        forexBuying,
        forexSelling,
        banknoteBuying,
        banknoteSelling,
        crossRateUSD,
      });
    }

    return {
      date,
      rates,
      success: true,
    };
  } catch (error) {
    console.error('TCMB fetch error:', error);
    throw error;
  }
}

/**
 * XML tag'inden değeri çıkar
 */
function extractTag(xml: string, tagName: string): string | null {
  const regex = new RegExp(`<${tagName}>([^<]+)<\/${tagName}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : null;
}

/**
 * TCMB verilerini standart formata dönüştür (USD veya TRY bazlı)
 */
export function convertTCMBToStandard(tcmbData: TCMBResponse, base: string = 'USD') {
  const rates: Record<string, number> = {};
  
  // USD kuru (TCMB'de USD/TRY)
  const usdRate = tcmbData.rates.find(r => r.code === 'USD');
  const usdToTry = usdRate ? usdRate.forexSelling : 1;
  
  if (base === 'USD') {
    // USD bazlı: 1 USD = X TRY
    rates['USD'] = 1;
    rates['TRY'] = usdToTry; // 1 USD = 42 TRY
    
    // Diğer para birimleri için USD cinsinden değer
    tcmbData.rates.forEach(rate => {
      if (rate.code !== 'USD') {
        // Örnek: EUR/TRY = 45, USD/TRY = 42 → 1 USD = 45/42 = 1.07 EUR
        rates[rate.code] = rate.forexSelling / usdToTry;
      }
    });
  } else if (base === 'TRY') {
    // TRY bazlı: 1 TRY = X USD
    rates['TRY'] = 1;
    rates['USD'] = 1 / usdToTry; // 1 TRY = 0.0238 USD
    
    // Diğer para birimleri için TRY cinsinden değer
    tcmbData.rates.forEach(rate => {
      if (rate.code !== 'USD') {
        // Direkt TCMB değerleri (1 TRY = X EUR)
        rates[rate.code] = 1 / rate.forexSelling;
      }
    });
  }

  return rates;
}
