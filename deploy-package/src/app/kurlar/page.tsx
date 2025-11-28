'use client';

import { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { formatNumber, formatPercentage, getCurrencyFlag } from '@/lib/utils';
import CurrencyChart from '@/components/chart/CurrencyChart';
import { useHistorical } from '@/hooks/useHistorical';

interface Rate {
  code: string;
  name: string;
  rate: number;
  buying: number;
  selling: number;
  popular?: boolean;
  change?: number;
  changePercent?: number;
}

export default function RatesPage() {
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [baseCurrency, setBaseCurrency] = useState('TRY');
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [dataSource, setDataSource] = useState<string>('');
  const [dataQuality, setDataQuality] = useState<string>('');
  const [reliability, setReliability] = useState<string>('');
  
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { data: historicalData, loading: chartLoading } = useHistorical({
    from: baseCurrency,
    to: selectedCurrency || 'TRY',
    days: 30,
  });

  const fetchRates = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/rates?base=${baseCurrency}`, {
        cache: 'no-store', // Force fresh data
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setRates(data.rates);
        setLastUpdate(data.lastUpdate);
        setDataSource(data.source);
        setDataQuality(data.dataQuality);
        setReliability(data.reliability);
      } else {
        console.error('API error:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch rates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchRates, 30000);
    
    return () => clearInterval(interval);
  }, [baseCurrency]);

  const filteredRates = rates.filter((rate) =>
    rate.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rate.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoriteRates = filteredRates.filter((rate) => isFavorite(rate.code));
  const otherRates = filteredRates.filter((rate) => !isFavorite(rate.code));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Anlık Döviz Kurları
            </h1>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Canlı</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <p className="text-gray-600 dark:text-gray-300">
                Son güncelleme: {lastUpdate || 'Yükleniyor...'}
              </p>
              {dataSource && (
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Kaynak:</span>
                  <span className="font-medium text-primary-600 dark:text-primary-400">{dataSource}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    dataQuality === 'OFFICIAL' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : dataQuality === 'VERIFIED'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {reliability}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={fetchRates}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Yenile</span>
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Para birimi ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={baseCurrency}
            onChange={(e) => setBaseCurrency(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="TRY">Baz: TRY (Türk Lirası)</option>
            <option value="USD">Baz: USD (Amerikan Doları)</option>
            <option value="EUR">Baz: EUR (Euro)</option>
            <option value="GBP">Baz: GBP (İngiliz Sterlini)</option>
          </select>
        </div>

        {/* Chart */}
        {selectedCurrency && (
          <div className="mb-8 animate-fade-in">
            <CurrencyChart
              data={historicalData}
              currency={selectedCurrency}
              baseCurrency={baseCurrency}
              loading={chartLoading}
            />
          </div>
        )}

        {/* Favorites Section */}
        {favoriteRates.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Favorilerim
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteRates.map((rate) => (
                <RateCard
                  key={rate.code}
                  rate={rate}
                  baseCurrency={baseCurrency}
                  isFavorite={true}
                  onToggleFavorite={toggleFavorite}
                  onSelect={setSelectedCurrency}
                  isSelected={selectedCurrency === rate.code}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Rates */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Tüm Kurlar
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherRates.map((rate) => (
                <RateCard
                  key={rate.code}
                  rate={rate}
                  baseCurrency={baseCurrency}
                  isFavorite={isFavorite(rate.code)}
                  onToggleFavorite={toggleFavorite}
                  onSelect={setSelectedCurrency}
                  isSelected={selectedCurrency === rate.code}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Rate Card Component
function RateCard({
  rate,
  baseCurrency,
  isFavorite,
  onToggleFavorite,
  onSelect,
  isSelected,
}: {
  rate: Rate;
  baseCurrency: string;
  isFavorite: boolean;
  onToggleFavorite: (code: string) => void;
  onSelect: (code: string) => void;
  isSelected: boolean;
}) {
  const change = rate.changePercent || 0;
  const isPositive = change > 0;
  const hasChange = Math.abs(change) > 0.01;

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 hover:shadow-card-hover transition-all cursor-pointer ${
        isSelected ? 'ring-2 ring-primary-500' : ''
      }`}
      onClick={() => onSelect(rate.code)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={getCurrencyFlag(rate.code)}
            alt={rate.code}
            className="w-8 h-6 object-cover rounded"
          />
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {rate.code}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {rate.name}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatNumber(rate.rate)}
          </span>
          {hasChange && (
            <div className={`flex items-center space-x-1 text-sm font-medium ${
              isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{formatPercentage(Math.abs(change))}</span>
            </div>
          )}
        </div>
        
        <div className="text-sm space-y-1">
          <p className="text-gray-600 dark:text-gray-400">
            1 {baseCurrency} = {formatNumber(rate.rate)} {rate.code}
          </p>
          {rate.buying && rate.selling && (
            <div className="flex justify-between text-xs">
              <span className="text-green-600 dark:text-green-400">
                Alış: {formatNumber(rate.buying)}
              </span>
              <span className="text-red-600 dark:text-red-400">
                Satış: {formatNumber(rate.selling)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
