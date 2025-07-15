import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useRef, useState } from 'react';
import {
  sensorDataApi,
  type TemperatureData,
  type TemperatureStats,
} from '../../../services/sensorDataApi';
import { formattedTime } from '../../../utils';
// import { useWarnMessage } from '../../../utils/useWarnMessage';
import { message } from 'antd';

type DataPoint = {
  time: number; // Unix timestamp
  value: number;
};

type TimescaleOption = {
  value: string;
  label: string;
  description: string;
};

// Static timescales configuration
const TIMESCALES: TimescaleOption[] = [
  { value: '1h', label: 'Last Hour', description: 'Last 60 minutes' },
  { value: '6h', label: 'Last 6 Hours', description: 'Last 6 hours' },
  { value: '1d', label: 'Last Day', description: 'Last 24 hours' },
  { value: '7d', label: 'Last Week', description: 'Last 7 days' },
  { value: '30d', label: 'Last Month', description: 'Last 30 days' },
];

const TemperatureDashboard: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [stats, setStats] = useState<TemperatureStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimescale, setSelectedTimescale] = useState<string>('1h');
  const intervalRef = useRef<number | null>(null);
  // const { showMessage, contextHolder } = useWarnMessage();
  // const [messageApi, contextHolder] = message.useMessage();
  // Fetch temperature data from API
  const fetchTemperatureData = async (timescale: string = '1h') => {
    try {
      setLoading(true);
      setError(null);
      // Get temperature data with timescale
      const response = await sensorDataApi.getTemperatures(timescale, 'raw');
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
      const statsResponse = await sensorDataApi.getTemperatureStats(timescale);
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
    }, 3000); // 3 seconds
    message.success('success get !');
    console.log('!!!1 data,stats');
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [selectedTimescale]);

  // useEffect(() => {
  //   console.log('!!!1 data,stats', stats, stats?.stats?.maxTemperature);
  //   if (stats?.stats?.maxTemperature > 40 && stats?.stats?.averageTemperature < 50) {
  //     console.log('here');
  //     // showMessage({
  //     //   type: 'warning',
  //     //   content: `The maximum temperature is over ${stats?.stats?.maxTemperature}0C,please note!\\n Proa AI System has called the owner of the Farm`,
  //     //   marginTop: '15vh',
  //     // });
  //   } else if (stats?.stats?.maxTemperature > 50) {
  //     const error = () => {
  //       messageApi.open({
  //         type: 'error',
  //         style: {
  //           marginTop: '10vh',
  //           zIndex: '100000',
  //         },
  //         content: `Warnning!The average temperature is over ${stats?.stats?.maxTemperature}0C,please note!\\n The message has been sent to the owner of the Farm`,
  //       });
  //     };
  //     error();
  //     // showMessage({
  //     //   type: 'warning',
  //     //   content: `Warnning!The average temperature is over ${stats?.stats?.maxTemperature}0C,please note!\\n The message has been sent to the owner of the Farm`,
  //     //   marginTop: '15vh',
  //     // });
  //   }
  // }, [stats?.stats?.averageTemperature]);

  const chartOption: echarts.EChartsOption = {
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
      formatter: (params: any) => {
        console.log('!!!! params', params);
        const data = params[0]; // only one series: Temperature
        const date = new Date(data.data[0]); // x value (timestamp)
        const value = data.data[1]; // y value (temperature)
        // Format date manually
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
  };

  if (loading && data?.length === 0) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading temperature dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h3>Error Loading Dashboard</h3>
        <p>{error}</p>
        <button
          onClick={() => {
            setError(null);
            fetchTemperatureData(selectedTimescale);
            fetchTemperatureStats(selectedTimescale);
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return data?.length > 0 ? (
    <div className="temperature-dashboard">
      {/* {contextHolder} */}
      <div className="dashboard-header">
        <h2>Temperature Dashboard</h2>
        <div className="timescale-selector">
          <label htmlFor="timescale">Time Range: </label>
          <select
            id="timescale"
            value={selectedTimescale}
            onChange={(e) => handleTimescaleChange(e.target.value)}
          >
            {TIMESCALES.map((timescale) => (
              <option key={timescale.value} value={timescale.value}>
                {timescale.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-label">Average</div>
              <div className="stat-value">{stats.stats.averageTemperature.toFixed(1)}°C</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📉</div>
            <div className="stat-content">
              <div className="stat-label">Minimum</div>
              <div className="stat-value">{stats.stats.minTemperature.toFixed(1)}°C</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <div className="stat-label">Maximum</div>
              <div className="stat-value">{stats.stats.maxTemperature.toFixed(1)}°C</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📏</div>
            <div className="stat-content">
              <div className="stat-label">Range</div>
              <div className="stat-value">{stats.stats.temperatureRange.toFixed(1)}°C</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔢</div>
            <div className="stat-content">
              <div className="stat-label">Readings</div>
              <div className="stat-value">{stats.stats.totalReadings}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-label">Std Dev</div>
              <div className="stat-value">{stats.stats.standardDeviation.toFixed(2)}°C</div>
            </div>
          </div>
        </div>
      )}

      {/* Chart Section */}
      <div className="chart-section">
        <ReactECharts option={chartOption} style={{ height: 400 }} />
      </div>

      {/* Data Summary */}
      {stats && (
        <div className="data-summary">
          <h3>Data Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <strong>First Reading:</strong> {formattedTime(new Date(stats.stats.firstReading))}
            </div>
            <div className="summary-item">
              <strong>Last Reading:</strong> {formattedTime(new Date(stats.stats.lastReading))}
            </div>
            <div className="summary-item">
              <strong>Time Range:</strong> {selectedTimescale}
            </div>
            <div className="summary-item">
              <strong>Data Points:</strong> {data.length}
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
    <div>No data available</div>
  );
};

export default TemperatureDashboard;
