import { useState, useEffect, useRef, useCallback } from 'react';
import * as echarts from 'echarts';
import {
  sensorDataApi,
  type TemperatureData,
  type TemperatureStats,
} from '../services/sensorDataApi';
import { formattedTime } from '../utils';

export type DataPoint = {
  time: number; // Unix timestamp
  value: number;
};

export type TimescaleOption = {
  value: string;
  label: string;
  description: string;
};

export const TIMESCALES: TimescaleOption[] = [
  { value: '1h', label: 'Last Hour', description: 'Last 60 minutes' },
  { value: '6h', label: 'Last 6 Hours', description: 'Last 6 hours' },
  { value: '1d', label: 'Last Day', description: 'Last 24 hours' },
  { value: '7d', label: 'Last Week', description: 'Last 7 days' },
  { value: '30d', label: 'Last Month', description: 'Last 30 days' },
];

export const useTemperatureChart = (initialTimescale: string = '1h') => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [stats, setStats] = useState<TemperatureStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimescale, setSelectedTimescale] = useState<string>(initialTimescale);
  const intervalRef = useRef<number | null>(null);

  const fetchTemperatureData = useCallback(async (timescale: string = '1h') => {
    try {
      setLoading(true);
      setError(null);

      const response = await sensorDataApi.getTemperatures(timescale, 'raw');

      const chartData: DataPoint[] = response?.data?.map((item: TemperatureData) => ({
        time: new Date(item.timestamp).getTime(),
        value: item.value,
      }));

      setData(chartData);
    } catch (err) {
      console.error('Error fetching temperature data:', err);
      setError('Failed to load temperature data');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTemperatureStats = useCallback(async (timescale: string = '1h') => {
    try {
      const statsResponse = await sensorDataApi.getTemperatureStats(timescale);
      setStats(statsResponse);
    } catch (err) {
      console.error('Error fetching temperature stats:', err);
      // Don't set error for stats, as it's not critical
    }
  }, []);

  const handleTimescaleChange = useCallback(
    (newTimescale: string) => {
      setSelectedTimescale(newTimescale);
      fetchTemperatureData(newTimescale);
      fetchTemperatureStats(newTimescale);
    },
    [fetchTemperatureData, fetchTemperatureStats],
  );

  const retry = useCallback(() => {
    setError(null);
    fetchTemperatureData(selectedTimescale);
    fetchTemperatureStats(selectedTimescale);
  }, [selectedTimescale, fetchTemperatureData, fetchTemperatureStats]);

  // Initial data fetch and periodic updates
  useEffect(() => {
    fetchTemperatureData(selectedTimescale);
    fetchTemperatureStats(selectedTimescale);

    intervalRef.current = window.setInterval(() => {
      fetchTemperatureData(selectedTimescale);
      fetchTemperatureStats(selectedTimescale);
    }, 3000); // 3 seconds

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [selectedTimescale, fetchTemperatureData, fetchTemperatureStats]);

  const getChartOption = useCallback(
    (): echarts.EChartsOption => ({
      title: {
        text: `Temperature Chart (${selectedTimescale})`,
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: unknown) => {
          const data = (params as Array<{ data: [number, number] }>)[0];
          const date = new Date(data.data[0]);
          const value = data.data[1];
          const time = formattedTime(date);
          return `${time} : ${value} °C`;
        },
      },
      xAxis: {
        type: 'time',
        name: 'Time',
        axisLabel: {
          formatter: (value: number) => {
            const date = new Date(value);
            return date.toLocaleTimeString();
          },
        },
      },
      yAxis: {
        type: 'value',
        name: '°C',
        min: stats ? Math.floor(stats.stats?.minTemperature - 2) : 'dataMin',
        max: stats ? Math.ceil(stats.stats?.maxTemperature + 2) : 'dataMax',
      },
      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: 0,
          start: 0,
          end: 100,
        },
        {
          type: 'inside',
          xAxisIndex: 0,
          start: 0,
          end: 100,
        },
      ],
      series: [
        {
          name: 'Temperature',
          type: 'line',
          showSymbol: false,
          smooth: true,
          areaStyle: {
            opacity: 0.3,
          },
          data: data?.map((d) => [d.time, d.value]),
        },
      ],
    }),
    [data, stats, selectedTimescale],
  );

  return {
    data,
    stats,
    loading,
    error,
    selectedTimescale,
    handleTimescaleChange,
    retry,
    getChartOption,
    TIMESCALES,
  };
};
