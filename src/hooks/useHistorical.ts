import { useState, useEffect } from 'react';
import { HistoricalDataPoint } from '@/types';

interface UseHistoricalParams {
  from: string;
  to: string;
  days?: number;
}

interface UseHistoricalReturn {
  data: HistoricalDataPoint[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook for fetching historical exchange rate data
 */
export function useHistorical({
  from,
  to,
  days = 30,
}: UseHistoricalParams): UseHistoricalReturn {
  const [data, setData] = useState<HistoricalDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistoricalData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/historical?from=${from}&to=${to}&days=${days}`
      );

      if (!response.ok) {
        throw new Error('Tarihsel veri alınamadı');
      }

      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Veri alınamadı');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
      setError(errorMessage);
      console.error('Historical data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (from && to) {
      fetchHistoricalData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, days]);

  return {
    data,
    loading,
    error,
    refetch: fetchHistoricalData,
  };
}
