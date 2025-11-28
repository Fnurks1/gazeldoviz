// GarantiBBVA Döviz Kurları Scraper

export interface GarantiRate {
  code: string;
  name: string;
  buying: number;
  selling: number;
  effectiveBuying?: number;
  effectiveSelling?: number;
  change?: number;
  changePercent?: number;
}

export interface GarantiData {
  rates: GarantiRate[];
  date: string;
  source: string;
  updateTime?: string;
}

/**
 * GarantiBBVA'dan döviz kurlarını çeker
 * Not: GarantiBBVA muhtemelen bir API kullanıyor, bu nedenle direkt API endpoint'ini kullanmaya çalışalım
 */
export async function fetchGarantiBBVARates(): Promise<GarantiData> {
  try {
    // GarantiBBVA'nın olası API endpoint'leri
    const possibleEndpoints = [
      'https://www.garantibbva.com.tr/api/exchange-rates',
      'https://api.garantibbva.com.tr/exchange-rates',
      'https://www.garantibbva.com.tr/exchange-rates/api',
      'https://www.garantibbva.com.tr/doviz-kurlari/api',
    ];

    let ratesData: GarantiRate[] = [];
    let apiFound = false;

    // API endpoint'lerini dene
    for (const endpoint of possibleEndpoints) {
      try {
        const response = await fetch(endpoint, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json',
          },
          next: { revalidate: 60 }
        });

        if (response.ok) {
          const data = await response.json();
          // API yanıtını parse et
          if (Array.isArray(data)) {
            ratesData = data;
            apiFound = true;
            break;
          } else if (data.rates && Array.isArray(data.rates)) {
            ratesData = data.rates;
            apiFound = true;
            break;
          }
        }
      } catch (err) {
        // Bu endpoint çalışmadı, devam et
        continue;
      }
    }

    // API bulunamadıysa, fallback olarak sabit kurlar kullan
    if (!apiFound || ratesData.length === 0) {
      console.log('GarantiBBVA API bulunamadı, TCMB verilerine düşülecek');
      throw new Error('GarantiBBVA API endpoint bulunamadı');
    }

    return {
      rates: ratesData,
      date: new Date().toISOString(),
      source: 'GarantiBBVA',
      updateTime: new Date().toLocaleString('tr-TR'),
    };
  } catch (error) {
    console.error('GarantiBBVA fetch hatası:', error);
    throw error;
  }
}

/**
 * GarantiBBVA verilerini standart formata dönüştürür
 */
export function convertGarantiToStandard(
  garantiData: GarantiData,
  baseCurrency: string = 'USD'
): Record<string, number> {
  const rates: Record<string, number> = {};
  
  // TRY'yi base olarak al (GarantiBBVA TRY bazlı çalışır)
  rates['TRY'] = 1;

  garantiData.rates.forEach((rate) => {
    // GarantiBBVA'daki kurlar TRY karşılığıdır
    // Alış ve satış ortalamasını kullan
    const avgRate = (rate.buying + rate.selling) / 2;
    rates[rate.code] = avgRate;
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

  return rates;
}

/**
 * Hardcoded GarantiBBVA kurları (fallback için)
 * Bu değerler periyodik olarak güncellenmelidir
 */
export function getGarantiFallbackRates(): GarantiData {
  const now = new Date();
  
  return {
    rates: [
      { code: 'USD', name: 'Amerikan Doları', buying: 34.2500, selling: 34.3500 },
      { code: 'EUR', name: 'Euro', buying: 37.1500, selling: 37.2800 },
      { code: 'GBP', name: 'İngiliz Sterlini', buying: 43.5000, selling: 43.7000 },
      { code: 'CHF', name: 'İsviçre Frangı', buying: 38.5000, selling: 38.7000 },
      { code: 'CAD', name: 'Kanada Doları', buying: 24.5000, selling: 24.7000 },
      { code: 'AUD', name: 'Avustralya Doları', buying: 22.3000, selling: 22.5000 },
      { code: 'SEK', name: 'İsveç Kronu', buying: 3.2500, selling: 3.3500 },
      { code: 'NOK', name: 'Norveç Kronu', buying: 3.1500, selling: 3.2500 },
      { code: 'DKK', name: 'Danimarka Kronu', buying: 4.9800, selling: 5.0800 },
      { code: 'JPY', name: 'Japon Yeni', buying: 0.2250, selling: 0.2350 },
      { code: 'SAR', name: 'Suudi Arabistan Riyali', buying: 9.1200, selling: 9.2500 },
      { code: 'KWD', name: 'Kuveyt Dinarı', buying: 111.5000, selling: 112.5000 },
      { code: 'AED', name: 'BAE Dirhemi', buying: 9.3200, selling: 9.4500 },
      { code: 'RUB', name: 'Rus Rublesi', buying: 0.3450, selling: 0.3650 },
    ],
    date: now.toISOString(),
    source: 'GarantiBBVA (Fallback)',
    updateTime: now.toLocaleString('tr-TR'),
  };
}
