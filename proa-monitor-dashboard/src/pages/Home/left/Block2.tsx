import ReactECharts from 'echarts-for-react';
import { useEffect, useState } from 'react';

import { PrimaryCard } from '../../../components/PrimaryCard';
import { useTemperatureUnit } from '../../../contexts/TemperatureContext';

import './Block2.css';

interface TemperatureDataPoint {
  time: string;
  temperature: number;
  type: 'past' | 'current' | 'future';
}

type TimeScale = 'second' | 'minute' | 'hour' | 'day' | 'month';
type YAxisScale = 'auto' | '2' | '5' | '10' | '20';

export default function Block2() {
  const [data, setData] = useState<TemperatureDataPoint[]>([]);
  const [timeScale, setTimeScale] = useState<TimeScale>('minute');
  const [yAxisScale, setYAxisScale] = useState<YAxisScale>('auto');
  const [currentTime, setCurrentTime] = useState<string>('');
  const { temperatureUnit } = useTemperatureUnit();

  // Get scale options based on temperature unit
  const getScaleOptions = () => {
    if (temperatureUnit === 'celsius') {
      return ['2°C', '5°C', '10°C'];
    } else {
      return ['5°F', '10°F', '20°F'];
    }
  };

  // Get scale value for chart
  const getScaleValue = (scale: YAxisScale) => {
    if (scale === 'auto') return 'auto';
    
    if (temperatureUnit === 'celsius') {
      switch (scale) {
        case '2': return 2;
        case '5': return 5;
        case '10': return 10;
        default: return 'auto';
      }
    } else {
      switch (scale) {
        case '5': return 5;
        case '10': return 10;
        case '20': return 20;
        default: return 'auto';
      }
    }
  };

  // Reset scale when temperature unit changes
  useEffect(() => {
    setYAxisScale('auto');
  }, [temperatureUnit]);

  useEffect(() => {
    const generateTemperatureData = () => {
      const now = new Date();
      const dataPoints: TemperatureDataPoint[] = [];
      const baseTemp = Math.floor(Math.random() * 20) + 15;

      let pointsCount = 0;
      let timeInterval = 0;

      switch (timeScale) {
        case 'second':
          pointsCount = 60;
          timeInterval = 1000;
          break;
        case 'minute':
          pointsCount = 60;
          timeInterval = 60000;
          break;
        case 'hour':
          pointsCount = 24;
          timeInterval = 3600000;
          break;
        case 'day':
          pointsCount = 30;
          timeInterval = 86400000;
          break;
        case 'month':
          pointsCount = 12;
          timeInterval = 2592000000;
          break;
      }

      for (let i = 0; i < pointsCount; i++) {
        const time = new Date(now.getTime() - (pointsCount - i - 1) * timeInterval);
        const isCurrent = i === pointsCount - 1;
        const isPast = i < pointsCount - 1;
        
        const tempVariation = Math.sin((i / pointsCount) * Math.PI * 2) * 5;
        const temperature = baseTemp + tempVariation + (Math.random() - 0.5) * 3;

        dataPoints.push({
          time: time.toLocaleTimeString('en-GB', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: timeScale === 'second' ? '2-digit' : undefined
          }),
          temperature: Math.round(temperature * 10) / 10,
          type: isCurrent ? 'current' : isPast ? 'past' : 'future'
        });
      }

      setData(dataPoints);
      setCurrentTime(now.toLocaleTimeString('en-GB', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    };

    generateTemperatureData();

    const interval = timeScale === 'second' ? 1000 : 
                    timeScale === 'minute' ? 60000 : 
                    timeScale === 'hour' ? 3600000 : 
                    timeScale === 'day' ? 86400000 : 2592000000;
    
    const intervalId = setInterval(generateTemperatureData, interval);

    return () => clearInterval(intervalId);
  }, [timeScale]);

  const getDisplayTemperature = (temp: number, unit: 'celsius' | 'fahrenheit') => {
    if (unit === 'fahrenheit') {
      return Math.round(((temp * 9/5) + 32) * 10) / 10;
    }
    return Math.round(temp * 10) / 10;
  };

  const getOption = () => {
    const pastData = data.filter(d => d.type === 'past');
    const currentData = data.filter(d => d.type === 'current');
    const futureData = data.filter(d => d.type === 'future');

    const allData = [...pastData, ...currentData, ...futureData];
    const times = allData.map(d => d.time);
    const temperatures = allData.map(d => getDisplayTemperature(d.temperature, temperatureUnit));

    const unitSymbol = temperatureUnit === 'celsius' ? '°C' : '°F';
    const scaleValue = getScaleValue(yAxisScale);

    return {
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          const data = params[0];
          return `${data.name}<br/>Temperature: ${data.value}${unitSymbol}`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: times,
        axisLabel: {
          color: '#fff',
          rotate: 45,
        },
        axisLine: { lineStyle: { color: '#666' } },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        name: `Temperature (${unitSymbol})`,
        nameTextStyle: { color: '#fff' },
        axisLabel: { color: '#fff' },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: '#444' } },
        ...(scaleValue !== 'auto' && {
          min: function(value: any) {
            return Math.floor(value.min / scaleValue) * scaleValue;
          },
          max: function(value: any) {
            return Math.ceil(value.max / scaleValue) * scaleValue;
          },
          interval: scaleValue
        })
      },
      series: [
        {
          name: 'Past Temperature',
          type: 'line',
          data: pastData.map(d => getDisplayTemperature(d.temperature, temperatureUnit)),
          lineStyle: { type: 'dashed', color: '#4ECDC4' },
          symbol: 'none',
          smooth: true,
        },
        {
          name: 'Current Temperature',
          type: 'scatter',
          data: currentData.map(d => getDisplayTemperature(d.temperature, temperatureUnit)),
          itemStyle: { color: '#FF6B6B' },
          symbolSize: 8,
        },
        {
          name: 'Future Temperature',
          type: 'line',
          data: futureData.map(d => getDisplayTemperature(d.temperature, temperatureUnit)),
          lineStyle: { type: 'dashed', color: '#FFD93D' },
          symbol: 'none',
          smooth: true,
        }
      ],
      backgroundColor: 'transparent',
    };
  };

  const handleTimeScaleChange = (scale: TimeScale) => {
    setTimeScale(scale);
  };

  const handleYAxisScaleChange = (scale: YAxisScale) => {
    setYAxisScale(scale);
  };

  const scaleOptions = getScaleOptions();

  return (
    <div className="block2">
      <PrimaryCard title="Temperature Trend Line">
        <div className="block2__content">
          <div className="block2__chart-container">
            <div className="block2__chart">
              {data.length > 0 && (
                <ReactECharts
                  key={`left-block2-chart-${timeScale}-${temperatureUnit}-${yAxisScale}`}
                  option={getOption()}
                  style={{ height: '100%', width: '100%' }}
                />
              )}
            </div>
            <div className="block2__controls">
              <div className="block2__scale-controls">
                <button
                  className={`block2__btn ${yAxisScale === 'auto' ? 'block2__btn--active' : ''}`}
                  onClick={() => handleYAxisScaleChange('auto')}
                >
                  Auto
                </button>
                {scaleOptions.map((option, index) => {
                  const scaleValue = temperatureUnit === 'celsius' 
                    ? ['2', '5', '10'][index] 
                    : ['5', '10', '20'][index];
                  return (
                    <button
                      key={option}
                      className={`block2__btn ${yAxisScale === scaleValue ? 'block2__btn--active' : ''}`}
                      onClick={() => handleYAxisScaleChange(scaleValue as YAxisScale)}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="block2__bottom-controls">
            <button
              className={`block2__btn ${timeScale === 'second' ? 'block2__btn--active' : ''}`}
              onClick={() => handleTimeScaleChange('second')}
            >
              Second
            </button>
            <button
              className={`block2__btn ${timeScale === 'minute' ? 'block2__btn--active' : ''}`}
              onClick={() => handleTimeScaleChange('minute')}
            >
              Minute
            </button>
            <button
              className={`block2__btn ${timeScale === 'hour' ? 'block2__btn--active' : ''}`}
              onClick={() => handleTimeScaleChange('hour')}
            >
              Hour
            </button>
            <button
              className={`block2__btn ${timeScale === 'day' ? 'block2__btn--active' : ''}`}
              onClick={() => handleTimeScaleChange('day')}
            >
              Day
            </button>
            <button
              className={`block2__btn ${timeScale === 'month' ? 'block2__btn--active' : ''}`}
              onClick={() => handleTimeScaleChange('month')}
            >
              Month
            </button>
          </div>
        </div>
      </PrimaryCard>
    </div>
  );
}
