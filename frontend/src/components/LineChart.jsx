'use client';

import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import useCurrency from '../hooks/useCurrency';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({ data, theme, label }) => {
  const isDarkMode = theme === 'dark';
  const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  const { currency } = useCurrency()
  const chartData = useMemo(() => {
    // Extract and sort all unique dates
    const allDates = data.map(d => d.date);
    const uniqueDates = [...new Set(allDates)].sort();

    const dataMap = new Map(data.map(d => [d.date, d.total]));

    return {
      labels: uniqueDates.map(date => new Date(date).toDateString().slice(4, 10)), // Format dates as 'MMM DD'
      datasets: [
        {
          label: label || 'Amount',
          data: uniqueDates.map(date => dataMap.get(date) || 0),
          borderColor: isDarkMode ? 'rgba(34, 197, 94, 0.8)' : 'rgba(34, 197, 94, 0.7)',
          backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [data, isDarkMode]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 8, right: 8, bottom: 28, left: 8 } },
      plugins: {
        legend: {
          labels: { color: textColor },
        },
        title: {
          display: true,
          text: 'Daily Activity (Last 30 Days)',
          color: textColor,
          font: { size: 16, weight: '600' },
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.parsed.y;
              return `${context.dataset.label}: ${currency.symbol}${value.toLocaleString()}`;
            },
          },
        },
      },
      scales: {
        y: {
          ticks: {
            color: textColor,
            callback: function(value) {
              return currency.symbol + value;
            }
          },
          grid: { color: gridColor },
          title: {
            display: true,
            text: `Amount (${currency.symbol})`,
            color: textColor,
            font: { size: 14 },
          },
        },
        x: {
          ticks: { color: textColor },
          grid: { color: gridColor },
          title: {
            display: true,
            text: 'Date',
            color: textColor,
            font: { size: 14 },
          },
        },
      },
    }),
    [textColor, gridColor, currency]
  );

  return <Line data={chartData} options={options} />;
};

export default LineChart;

