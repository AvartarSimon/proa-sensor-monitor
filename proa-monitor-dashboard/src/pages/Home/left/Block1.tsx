import { useEffect, useState } from 'react';
import { PrimaryCard } from '../../../components/PrimaryCard';
import type { ECOption } from '../../../components/SuperEChart';
import { SuperEChart } from '../../../components/SuperEChart';
import { useTemperatureUnit } from '../../../contexts/TemperatureContext';
import './Block1.css';

export default function Block1() {
  const [currentTemp, setCurrentTemp] = useState(25);
  const [isRunning, setIsRunning] = useState(true);
  const { temperatureUnit, setTemperatureUnit } = useTemperatureUnit();

  useEffect(() => {
    if (!isRunning) return;

    const generateTemperature = () => {
      return Math.round((Math.random() * 30 + 10) * 10) / 10;
    };

    setCurrentTemp(generateTemperature());

    const intervalId = setInterval(() => {
      setCurrentTemp(generateTemperature());
    }, 5000);

    return () => clearInterval(intervalId);
  }, [isRunning]);

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(true);
    setCurrentTemp(Math.round((Math.random() * 30 + 10) * 10) / 10);
  };

  const handleTemperatureUnitChange = (unit: 'celsius' | 'fahrenheit') => {
    setTemperatureUnit(unit);
  };

  const getDisplayTemperature = (temp: number, unit: 'celsius' | 'fahrenheit') => {
    if (unit === 'fahrenheit') {
      return Math.round(((temp * 9/5) + 32) * 10) / 10;
    }
    return Math.round(temp * 10) / 10;
  };

  const displayTemp = getDisplayTemperature(currentTemp, temperatureUnit);
  const unitSymbol = temperatureUnit === 'celsius' ? '°C' : '°F';

  const getOption = (): ECOption => {
    const percentage = ((displayTemp - 10) / (40 - 10)) * 100;

    return {
      title: {
        text: 'Current Temperature',
        left: 'center',
        top: '10%',
        textStyle: {
          color: '#fff',
          fontSize: 18,
          fontWeight: 'normal'
        }
      },
      series: [
        {
          type: 'gauge',
          radius: '100%',
          center: ['50%', '55%'],
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
          splitNumber: 10,
          axisLine: {
            lineStyle: {
              width: 25,
              color: [
                [0.3, '#67e0e3'],
                [0.7, '#37a2da'],
                [1, '#fd666d']
              ]
            }
          },
          pointer: {
            length: '60%',
            width: 8,
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            distance: -25,
            length: 10,
            splitNumber: 5,
            lineStyle: {
              color: '#fff',
              width: 2
            }
          },
          splitLine: {
            distance: -25,
            length: 25,
            lineStyle: {
              color: '#fff',
              width: 3
            }
          },
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.8)',
            distance: 20,
            fontSize: 14,
            formatter: (value) => {
              const temp = Math.round(10 + (value / 100) * 30);
              return temperatureUnit === 'celsius' 
                ? `${temp}°C` 
                : `${Math.round((temp * 9/5) + 32)}°F`;
            }
          },
          detail: {
            valueAnimation: true,
            formatter: function() {
              return `${Math.round(displayTemp * 10) / 10}${unitSymbol}`;
            },
            color: '#fff',
            fontSize: 40,
            fontWeight: 'bolder',
            offsetCenter: [0, '70%']
          },
          animationDuration: 1000,
          animationEasing: 'elasticOut',
          animationDurationUpdate: 1000,
          data: [
            {
              value: percentage
            }
          ]
        }
      ]
    };
  };

  return (
    <div className="block1">
      <PrimaryCard title="Current Temperature Gauge">
        <div className="block1__content">
          <div className="block1__chart-container">
            <div className="block1__chart">
              <SuperEChart options={getOption()} />
            </div>
            <div className="block1__unit-controls">
              <button
                className={`block1__unit-btn ${temperatureUnit === 'celsius' ? 'block1__unit-btn--active' : ''}`}
                onClick={() => handleTemperatureUnitChange('celsius')}
              >
                °C
              </button>
              <button
                className={`block1__unit-btn ${temperatureUnit === 'fahrenheit' ? 'block1__unit-btn--active' : ''}`}
                onClick={() => handleTemperatureUnitChange('fahrenheit')}
              >
                °F
              </button>
            </div>
          </div>
          <div className="block1__controls">
            <div className="block1__action-controls">
              <button
                className={`block1__btn ${!isRunning ? 'block1__btn--active' : ''}`}
                onClick={handleStop}
              >
                Stop
              </button>
              <button
                className="block1__btn"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </PrimaryCard>
    </div>
  );
}