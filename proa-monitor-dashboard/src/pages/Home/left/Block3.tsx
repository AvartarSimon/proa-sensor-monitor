import ReactECharts from 'echarts-for-react';
import { useEffect, useState } from 'react';

import { PrimaryCard } from '../../../components/PrimaryCard';

import './Block3.css';

interface TemperatureComparisonData {
  time: string;
  currentTemp: number;
  historicalAvg: number;
  percentageChange: number;
}

type TimeRange = 'second' | 'minute' | 'day';

export default function Block3() {
  const [data, setData] = useState<TemperatureComparisonData[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('minute');

  useEffect(() => {
    const generateTemperatureData = () => {
      const currentTemp = Math.round((Math.random() * 30 + 10) * 10) / 10;
      const historicalAvg = Math.round((Math.random() * 25 + 12) * 10) / 10;
      const percentageChange = ((currentTemp - historicalAvg) / historicalAvg) * 100;

      const now = new Date();
      const timeString = now.toLocaleTimeString('en-GB', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      setData((prev) => {
        const newData = [
          ...prev,
          {
            time: timeString,
            currentTemp,
            historicalAvg,
            percentageChange,
          },
        ];

        return newData.slice(-20);
      });
    };

    generateTemperatureData();

    const interval = timeRange === 'second' ? 1000 : timeRange === 'minute' ? 60000 : 86400000;

    const intervalId = setInterval(generateTemperatureData, interval);

    return () => clearInterval(intervalId);
  }, [timeRange]);

  const latestData = data[data?.length - 1];
  const isHigher = latestData?.percentageChange > 0;

  const getOption = () => {
    if (!latestData) return {};

    const { currentTemp, historicalAvg, percentageChange } = latestData;

    return {
      tooltip: {
        trigger: 'item',
        formatter: function (params: any) {
          return `${params.name}: ${params.value}°C`;
        },
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '85%'],
          center: ['50%', '45%'],
          data: [
            {
              name: 'Current Temperature',
              value: currentTemp,
              itemStyle: { color: '#FF6B6B' },
            },
            {
              name: 'Historical Average',
              value: historicalAvg,
              itemStyle: { color: '#4ECDC4' },
            },
          ],
          label: {
            show: true,
            formatter: function (params: any) {
              return `${params.name}\n${params.value}°C`;
            },
            color: '#fff',
            fontSize: 14,
            fontWeight: 'bold',
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 15,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
      backgroundColor: 'transparent',
    };
  };

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };

  return (
    <div className="block3">
      <PrimaryCard title="Temperature Comparison">
        <div className="block3__content">
          <div className="block3__chart">
            {latestData && (
              <ReactECharts
                key={`left-block3-chart-${timeRange}`}
                option={getOption()}
                style={{ height: '100%', width: '100%' }}
              />
            )}
          </div>
          <div className="block3__info">
            <div className="block3__comparison">
              <div className="block3__current">
                <span className="block3__label">Current:</span>
                <span className="block3__value">{latestData?.currentTemp}°C</span>
              </div>
              <div className="block3__historical">
                <span className="block3__label">Historical Avg:</span>
                <span className="block3__value">{latestData?.historicalAvg}°C</span>
              </div>
              <div className="block3__change">
                <span className="block3__label">Change:</span>
                <span
                  className={`block3__value ${isHigher ? 'block3__value--up' : 'block3__value--down'}`}
                >
                  {isHigher ? '↗' : '↘'} {Math.abs(latestData?.percentageChange || 0).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="block3__controls">
              <button
                className={`block3__btn ${timeRange === 'second' ? 'block3__btn--active' : ''}`}
                onClick={() => handleTimeRangeChange('second')}
              >
                Second
              </button>
              <button
                className={`block3__btn ${timeRange === 'minute' ? 'block3__btn--active' : ''}`}
                onClick={() => handleTimeRangeChange('minute')}
              >
                Minute
              </button>
              <button
                className={`block3__btn ${timeRange === 'day' ? 'block3__btn--active' : ''}`}
                onClick={() => handleTimeRangeChange('day')}
              >
                Day
              </button>
            </div>
          </div>
        </div>
      </PrimaryCard>
    </div>
  );
}
