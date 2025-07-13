import { useEffect, useState } from 'react';

import { PrimaryCard } from '../../../components/PrimaryCard';
import type { ECOption } from '../../../components/SuperEChart';
import { SuperEChart } from '../../../components/SuperEChart';
import { toAdaptedPx } from '../../../utils';

import './Block3.css';

interface TemperatureHumidityComparisonData {
  time: string;
  currentTemp: number;
  historicalHumidity: number;
  percentageChange: number;
}

type TimeRange = 'second' | 'minute' | 'day';

export default function Block3() {
  const [data, setData] = useState<TemperatureHumidityComparisonData[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('minute');

  useEffect(() => {
    // Generate temperature vs humidity comparison data
    const generateComparisonData = () => {
      const currentTemp = Math.round((Math.random() * 30 + 10) * 10) / 10; // 10-40°C
      const historicalHumidity = Math.floor(Math.random() * 40) + 30; // 30-70% humidity
      const percentageChange = ((currentTemp - historicalHumidity) / historicalHumidity * 100);
      
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-GB', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      setData(prev => {
        const newData = [...prev, {
          time: timeString,
          currentTemp,
          historicalHumidity,
          percentageChange
        }];
        
        // Keep only last 20 data points
        return newData.slice(-20);
      });
    };

    // Initial data generation
    generateComparisonData();

    // Update based on time range
    const interval = timeRange === 'second' ? 1000 : 
                    timeRange === 'minute' ? 60000 : 86400000;
    
    const intervalId = setInterval(generateComparisonData, interval);

    return () => clearInterval(intervalId);
  }, [timeRange]);

  const latestData = data[data.length - 1];
  const isHigher = latestData?.percentageChange > 0;

  return (
    <div className="block3">
      <PrimaryCard title="Temperature vs Historical Humidity">
        <div className="block3__content">
          {/* Percentage indicator */}
          {latestData && (
            <div className="block3__percentage">
              <div className={`block3__percentage-indicator ${isHigher ? 'block3__percentage-indicator--higher' : 'block3__percentage-indicator--lower'}`}>
                <span className="block3__percentage-arrow">
                  {isHigher ? '↗' : '↘'}
                </span>
                <span className="block3__percentage-value">
                  {Math.abs(latestData.percentageChange).toFixed(1)}%
                </span>
              </div>
              <div className="block3__percentage-label">
                {isHigher ? 'Higher than' : 'Lower than'} 3-year humidity average
              </div>
            </div>
          )}
          
          {/* Chart */}
          {data.length === 0 ? (
            <div className="block3__loading">Loading...</div>
          ) : (
            <div className="block3__chart">
              <SuperEChart
                key={`right-block3-chart-${timeRange}`}
                style={{ height: '100px', width: '100%' }}
                options={getChart(data)}
              />
            </div>
          )}
          
          {/* Time controls */}
          <div className="block3__controls">
            <button 
              className={`block3__time-btn ${timeRange === 'second' ? 'block3__time-btn--active' : ''}`}
              onClick={() => setTimeRange('second')}
            >
              Second
            </button>
            <button 
              className={`block3__time-btn ${timeRange === 'minute' ? 'block3__time-btn--active' : ''}`}
              onClick={() => setTimeRange('minute')}
            >
              Minute
            </button>
            <button 
              className={`block3__time-btn ${timeRange === 'day' ? 'block3__time-btn--active' : ''}`}
              onClick={() => setTimeRange('day')}
            >
              Day
            </button>
          </div>
        </div>
      </PrimaryCard>
    </div>
  );
}

function getChart(data: TemperatureHumidityComparisonData[]): ECOption {
  if (data.length === 0) {
    return {
      xAxis: { type: 'category', data: ['No Data'] },
      yAxis: { type: 'value' },
      series: [
        {
          name: 'Current Temperature',
          type: 'line',
          data: [0]
        },
        {
          name: '3-Year Humidity Avg',
          type: 'line',
          data: [0]
        }
      ]
    };
  }

  const times = data.map(d => d.time);
  const currentTemps = data.map(d => d.currentTemp);
  const historicalHumidities = data.map(d => d.historicalHumidity);

  return {
    tooltip: {
      trigger: 'axis',
      formatter: function(params: any) {
        const temp = params[0];
        const humidity = params[1];
        const percentage = ((temp.value - humidity.value) / humidity.value * 100);
        const changeText = percentage > 0 ? `+${percentage.toFixed(1)}%` : `${percentage.toFixed(1)}%`;
        const color = percentage > 0 ? '#52c41a' : '#ff4d4f';
        
        return `${temp.name}<br/>
                Temperature: ${temp.value}°C<br/>
                Historical Humidity: ${humidity.value}%<br/>
                <span style="color: ${color}">${changeText}</span>`;
      }
    },
    legend: {
      data: ['Current Temperature', '3-Year Humidity Avg'],
      textStyle: { color: 'rgba(255, 255, 255, 0.85)' },
      top: toAdaptedPx(10)
    },
    grid: {
      left: toAdaptedPx(60),
      right: toAdaptedPx(20),
      top: toAdaptedPx(50),
      bottom: toAdaptedPx(40)
    },
    xAxis: {
      type: 'category',
      data: times,
      axisLabel: { color: 'rgba(255, 255, 255, 0.65)' },
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Temperature (°C)',
        nameTextStyle: { color: 'rgba(255, 255, 255, 0.85)' },
        axisLabel: { color: 'rgba(255, 255, 255, 0.65)' },
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
      },
      {
        type: 'value',
        name: 'Humidity (%)',
        nameTextStyle: { color: 'rgba(255, 255, 255, 0.85)' },
        axisLabel: { color: 'rgba(255, 255, 255, 0.65)' },
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: 'Current Temperature',
        type: 'line',
        data: currentTemps,
        smooth: true,
        lineStyle: { color: '#4ECDC4', width: 3 },
        itemStyle: { color: '#4ECDC4' },
        areaStyle: {
          color: 'rgba(78, 205, 196, 0.2)'
        }
      },
      {
        name: '3-Year Humidity Avg',
        type: 'line',
        data: historicalHumidities,
        yAxisIndex: 1,
        smooth: true,
        lineStyle: { color: '#FF8B94', width: 2, type: 'dashed' },
        itemStyle: { color: '#FF8B94' }
      }
    ]
  };
}
