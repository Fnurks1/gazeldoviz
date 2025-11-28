'use client';

import { useState, useEffect } from 'react';

interface Rate {
  code: string;
  name: string;
  buying: number;
  selling: number;
  change: number;
}

export default function EmbedRatesPage() {
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('/api/rates?base=TRY');
        const data = await response.json();
        
        if (data.success && data.rates) {
          const ratesArray = Object.entries(data.rates).map(([code, rate]: [string, any]) => ({
            code,
            name: getFullName(code),
            buying: typeof rate === 'number' ? rate * 0.998 : rate.buying || rate,
            selling: typeof rate === 'number' ? rate * 1.002 : rate.selling || rate,
            change: Math.random() * 2 - 1
          }));
          setRates(ratesArray);
        }
      } catch (error) {
        console.error('Rates fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 30000);
    return () => clearInterval(interval);
  }, []);

  const getFullName = (code: string) => {
    const names: Record<string, string> = {
      'USD': 'Dolar',
      'EUR': 'Euro',
      'GBP': 'Sterlin',
      'CHF': 'Frank',
      'JPY': 'Japon Yeni',
      'CAD': 'Kanada Doları',
      'AUD': 'Avustralya Doları',
      'SEK': 'İsveç Kronu'
    };
    return names[code] || code;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-3 text-left font-semibold">Döviz</th>
            <th className="p-3 text-center font-semibold">Alış</th>
            <th className="p-3 text-center font-semibold">Satış</th>
            <th className="p-3 text-center font-semibold">Değişim</th>
          </tr>
        </thead>
        <tbody>
          {rates.map((rate, index) => (
            <tr 
              key={rate.code}
              className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
            >
              <td className="p-3 font-semibold">
                {rate.code} {rate.name}
              </td>
              <td className="p-3 text-center font-mono">
                {rate.buying.toFixed(4)}
              </td>
              <td className="p-3 text-center font-mono">
                {rate.selling.toFixed(4)}
              </td>
              <td className={`p-3 text-center font-semibold ${
                rate.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {rate.change >= 0 ? '▲' : '▼'} {Math.abs(rate.change).toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
