import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useRef, useState } from 'react';
import { getTemperatures, getTemperatureStats } from '../../../services';

import type { TemperatureData, TemperatureStats } from '../../../services/types';

import { timescalesConfig } from '../../../utils/chartConfig';

type DataPoint = {
  time: number; // Unix timestamp
  value: number;
};

type TimescaleOption = {
  value: string;
  label: string;
  description: string;
};

const TemperatureChart: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [stats, setStats] = useState<TemperatureStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimescale, setSelectedTimescale] = useState<string>('1h');
  const intervalRef = useRef<number | null>(null);

  // Fetch temperature data from API
  const fetchTemperatureData = async (timescale: string = '1h') => {
    try {
      setLoading(true);
      setError(null);

      // Get temperature data with timescale
      const response = await getTemperatures(timescale, 'raw');

      // Transform API data to chart format
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
  };

  // Fetch temperature statistics
  const fetchTemperatureStats = async (timescale: string = '1h') => {
    try {
      const statsResponse = await getTemperatureStats(timescale);
      setStats(statsResponse);
    } catch (err) {
      console.error('Error fetching temperature stats:', err);
      // Don't set error for stats, as it's not critical
    }
  };

  // Handle timescale change
  const handleTimescaleChange = (newTimescale: string) => {
    setSelectedTimescale(newTimescale);
    fetchTemperatureData(newTimescale);
    fetchTemperatureStats(newTimescale);
  };

  // Initial data fetch and periodic updates
  useEffect(() => {
    // Fetch data immediately
    fetchTemperatureData(selectedTimescale);
    fetchTemperatureStats(selectedTimescale);

    // Set up periodic updates every 30 seconds
    intervalRef.current = window.setInterval(() => {
      fetchTemperatureData(selectedTimescale);
      fetchTemperatureStats(selectedTimescale);
    }, 30000); // 30 seconds

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [selectedTimescale]);

  const option: echarts.EChartsOption = {
    title: {
      text: `Temperature Data (${selectedTimescale})`,
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b} : {c} °C',
    },
    xAxis: {
      type: 'time',
      name: 'Time',
    },
    yAxis: {
      type: 'value',
      name: '°C',
      min: stats ? Math.floor(stats?.stats?.minTemperature - 2) : 'dataMin',
      max: stats ? Math.ceil(stats?.stats?.maxTemperature + 2) : 'dataMax',
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
  };

  if (loading && data?.length === 0) {
    return (
      <div
        style={{
          height: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p>Loading temperature data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          height: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'red',
        }}
      >
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="temperature-chart">
      {/* Timescale Selector */}
      <div className="timescale-selector">
        <label htmlFor="timescale">Time Range: </label>
        <select
          id="timescale"
          value={selectedTimescale}
          onChange={(e) => handleTimescaleChange(e.target.value)}
        >
          {timescalesConfig?.timescales?.map((timescale) => (
            <option key={timescale.value} value={timescale.value}>
              {timescale.label}
            </option>
          ))}
        </select>
      </div>

      {/* Statistics Display */}
      {stats && (
        <div className="stats-display">
          <div className="stat-item">
            <span className="stat-label">Average:</span>
            <span className="stat-value">{stats.stats?.averageTemperature?.toFixed(1)}°C</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Min:</span>
            <span className="stat-value">{stats.stats?.minTemperature?.toFixed(1)}°C</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Max:</span>
            <span className="stat-value">{stats.stats?.maxTemperature?.toFixed(1)}°C</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Range:</span>
            <span className="stat-value">{stats.stats?.temperatureRange?.toFixed(1)}°C</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Readings:</span>
            <span className="stat-value">{stats.stats?.totalReadings}</span>
          </div>
        </div>
      )}

      {/* Chart */}
      <ReactECharts option={option} style={{ height: 400 }} />
    </div>
  );
};

export default TemperatureChart;
