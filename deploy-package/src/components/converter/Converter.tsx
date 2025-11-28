'use client';

import { useState, useEffect } from 'react';
import { ArrowLeftRight, TrendingUp, TrendingDown } from 'lucide-react';
import { ConverterProps } from '@/types';
import { formatNumber, formatPercentage, getCurrencyFlag, getCurrencySymbol } from '@/lib/utils';

export default function Converter({
  defaultFrom = 'USD',
  defaultTo = 'TRY',
  defaultAmount = 100,
}: ConverterProps) {
  const [fromCurrency, setFromCurrency] = useState(defaultFrom);
  const [toCurrency, setToCurrency] = useState(defaultTo);
  const [amount, setAmount] = useState(defaultAmount.toString());
  const [result, setResult] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [previousRate, setPreviousRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState<string>('');
  const [reliability, setReliability] = useState<string>('');
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [buyingSelling, setBuyingSelling] = useState<{ buying: number; selling: number } | null>(null);

  // Fetch available currencies and set initial data
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        // Fetch with TRY as base (default) since TCMB provides rates in this format
        const response = await fetch('/api/rates?base=TRY');
        const data = await response.json();
        
        if (data.success) {
          setCurrencies(data.rates);
          setDataSource(data.source);
          setReliability(data.reliability);
          setLastUpdate(data.lastUpdate);
        }
      } catch (err) {
        console.error('Failed to fetch currencies:', err);
      }
    };

    fetchCurrencies();
    
    // Refresh currencies every 30 seconds
    const interval = setInterval(fetchCurrencies, 30000);
    return () => clearInterval(interval);
  }, []);

  // Perform conversion
  const convert = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Geçerli bir miktar girin');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/rates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromCurrency,
          to: toCurrency,
          amount: parseFloat(amount),
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store previous rate for comparison
        if (rate !== null) {
          setPreviousRate(rate);
        }
        setResult(data.result);
        setRate(data.rate);
        setDataSource(data.source);
        
        // Get buying/selling rates from currencies list
        const toCurr = currencies.find(c => c.code === toCurrency);
        if (toCurr && toCurr.buying && toCurr.selling) {
          setBuyingSelling({ buying: toCurr.buying, selling: toCurr.selling });
        }
      } else {
        setError(data.error || 'Dönüşüm başarısız');
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      console.error('Conversion error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-convert on input change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (amount && parseFloat(amount) > 0) {
        convert();
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, fromCurrency, toCurrency]);

  // Swap currencies
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 md:p-8 transition-all duration-300">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Döviz Çevirici
        </h2>
        
        {/* Live indicator */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Anlık Kurlar</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* From Currency */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Gönderen Para Birimi
            </label>
            <div className="relative">
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
              {fromCurrency && (
                <img
                  src={getCurrencyFlag(fromCurrency)}
                  alt={fromCurrency}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-4 object-cover rounded pointer-events-none"
                />
              )}
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Miktar girin"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              min="0"
              step="0.01"
            />
          </div>

          {/* To Currency */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Alan Para Birimi
            </label>
            <div className="relative">
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
              {toCurrency && (
                <img
                  src={getCurrencyFlag(toCurrency)}
                  alt={toCurrency}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-4 object-cover rounded pointer-events-none"
                />
              )}
            </div>
            <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-semibold text-lg">
              {loading ? (
                <span className="text-gray-400">Hesaplanıyor...</span>
              ) : result !== null ? (
                <span>
                  {getCurrencySymbol(toCurrency)} {formatNumber(result)}
                </span>
              ) : (
                <span className="text-gray-400">Sonuç</span>
              )}
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleSwap}
            className="p-3 rounded-full bg-primary-500 text-white hover:bg-primary-600 focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-800 transition-all transform hover:rotate-180 duration-300"
            aria-label="Swap currencies"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
        </div>

        {/* Exchange Rate Info with Price Change */}
        {rate !== null && !loading && (
          <div className="space-y-3 mb-4">
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 border border-primary-100 dark:border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Anlık Kur:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                    1 {fromCurrency} = {formatNumber(rate)} {toCurrency}
                  </span>
                  {previousRate !== null && previousRate !== rate && (
                    <div className={`flex items-center space-x-1 text-sm font-semibold ${
                      rate > previousRate 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {rate > previousRate ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>
                        {formatPercentage(Math.abs(((rate - previousRate) / previousRate) * 100))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Data Source Info */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 dark:text-gray-400">Kaynak:</span>
                  <span className="font-medium text-primary-600 dark:text-primary-400">{dataSource}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 font-semibold">
                  {reliability}
                </span>
              </div>
              
              {/* Buying/Selling Rates */}
              {buyingSelling && (
                <div className="flex justify-between mt-3 pt-3 border-t border-primary-200 dark:border-gray-600">
                  <div className="text-center flex-1">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Alış</div>
                    <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {formatNumber(buyingSelling.buying)}
                    </div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Satış</div>
                    <div className="text-sm font-semibold text-red-600 dark:text-red-400">
                      {formatNumber(buyingSelling.selling)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Last Update */}
            {lastUpdate && (
              <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                Son güncelleme: {lastUpdate}
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Convert Button */}
        <button
          onClick={convert}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700 focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? 'Hesaplanıyor...' : 'Çevir'}
        </button>
      </div>
    </div>
  );
}
