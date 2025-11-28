// Type definitions for API responses

export interface ExchangeRate {
  code: string;
  name: string;
  rate: number;
  change?: number;
  changePercent?: number;
  flag?: string;
}

export interface ExchangeRatesResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  conversion_rates: Record<string, number>;
}

export interface ConversionResult {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  timestamp: number;
}

export interface HistoricalDataPoint {
  date: string;
  rate: number;
}

export interface HistoricalDataResponse {
  base: string;
  target: string;
  data: HistoricalDataPoint[];
}

export interface Currency {
  code: string;
  name: string;
  symbol?: string;
  flag?: string;
  popular?: boolean;
}

export interface FavoriteCurrency {
  code: string;
  addedAt: number;
}

export interface CacheConfig {
  staleTime: number;
  cacheTime: number;
  refetchInterval?: number;
}

// UI Types
export type Theme = 'light' | 'dark';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

// Component Props Types
export interface ConverterProps {
  defaultFrom?: string;
  defaultTo?: string;
  defaultAmount?: number;
}

export interface ChartProps {
  data: HistoricalDataPoint[];
  currency: string;
  baseCurrency: string;
  loading?: boolean;
}

export interface CurrencyCardProps {
  currency: ExchangeRate;
  isFavorite?: boolean;
  onToggleFavorite?: (code: string) => void;
}
