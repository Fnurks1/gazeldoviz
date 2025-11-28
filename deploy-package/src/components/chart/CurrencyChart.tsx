'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ChartProps } from '@/types';
import { formatNumber } from '@/lib/utils';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function CurrencyChart({
  data,
  currency,
  baseCurrency,
  loading = false,
}: ChartProps) {
  const chartRef = useRef(null);

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="animate-pulse text-gray-400">Grafik yükleniyor...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="text-gray-400">Veri bulunamadı</div>
      </div>
    );
  }

  const chartData = {
    labels: data.map((point) => {
      const date = new Date(point.date);
      return date.toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: `${baseCurrency}/${currency}`,
        data: data.map((point) => point.rate),
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(14, 165, 233)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: 'rgb(107, 114, 128)',
          font: {
            size: 12,
            weight: 500,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgb(14, 165, 233)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (context: any) {
            return `Kur: ${formatNumber(context.parsed.y)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgb(107, 114, 128)',
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: 'rgb(107, 114, 128)',
          callback: function (value: any) {
            return formatNumber(value, 2);
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Tarihsel Kur Grafiği
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {baseCurrency}/{currency} - Son {data.length} gün
          </p>
        </div>
        <div className="h-64 md:h-80">
          <Line ref={chartRef} data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
}
