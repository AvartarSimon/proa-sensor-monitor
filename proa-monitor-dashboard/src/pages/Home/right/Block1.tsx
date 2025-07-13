import ReactECharts from 'echarts-for-react';
import { useEffect, useState } from 'react';

import { PrimaryCard } from '../../../components/PrimaryCard';
import { toAdaptedPx } from '../../../utils';

import './Block1.css';

interface HumidityData {
  year: string;
  v1: number;
  v2: number;
  v3: number;
  v4: number;
}

export default function Block1() {
  const [humidityData, setHumidityData] = useState<HumidityData[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');

  const generateHumidityData = () => {
    const days: HumidityData[] = [];
    const today = new Date();

    for (let i = 4; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const dayData: HumidityData = {
        year: date.getFullYear().toString(),
        v1: Math.floor(Math.random() * 30) + 40,
        v2: Math.floor(Math.random() * 25) + 35,
        v3: Math.floor(Math.random() * 20) + 30,
        v4: Math.floor(Math.random() * 15) + 25,
      };
      days.push(dayData);
    }

    setHumidityData(days);
  };

  useEffect(() => {
    generateHumidityData();

    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const year = now.getFullYear();
      setCurrentTime(`${hours}:${minutes}:${seconds} ${day}/${month}/${year}`);
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0).getTime() -
      now.getTime();

    const dataInterval = setTimeout(() => {
      generateHumidityData();
      setInterval(generateHumidityData, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);

    return () => {
      clearInterval(timeInterval);
      clearTimeout(dataInterval);
    };
  }, []);

  const getOption = () => {
    const dates = humidityData.map((day) => day.year);
    const series = [
      {
        name: 'Indoor Humidity',
        type: 'bar',
        data: humidityData.map((day) => day.v1),
        itemStyle: { color: '#4ECDC4' },
        label: {
          show: true,
          position: 'top',
          color: '#fff',
        },
      },
      {
        name: 'Outdoor Humidity',
        type: 'bar',
        data: humidityData.map((day) => day.v2),
        itemStyle: { color: '#FF6B6B' },
        label: {
          show: true,
          position: 'top',
          color: '#fff',
        },
      },
      {
        name: 'Greenhouse Humidity',
        type: 'bar',
        data: humidityData.map((day) => day.v3),
        itemStyle: { color: '#FFD93D' },
        label: {
          show: true,
          position: 'top',
          color: '#fff',
        },
      },
      {
        name: 'Storage Humidity',
        type: 'bar',
        data: humidityData.map((day) => day.v4),
        itemStyle: { color: '#FF8B94' },
        label: {
          show: true,
          position: 'top',
          color: '#fff',
        },
      },
    ];

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      legend: {
        data: [
          'Indoor Humidity',
          'Outdoor Humidity',
          'Greenhouse Humidity',
          'Storage Humidity',
        ],
        textStyle: { color: '#fff' },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
          color: '#fff',
          rotate: 0,
        },
        axisLine: { lineStyle: { color: '#666' } },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#fff' },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: '#444' } },
      },
      series: series,
      backgroundColor: 'transparent',
    };
  };

  return (
    <div className="block1">
      <PrimaryCard title="Humidity Monitoring (5-Days Trend)">
        <div
          className="block1__chart"
          style={{ height: toAdaptedPx(450), position: 'relative' }}>
          {humidityData?.length > 0 && (
            <ReactECharts
              key="right-block1-chart"
              option={getOption()}
              style={{ height: '100%', width: '100%' }}
            />
          )}
        </div>
      </PrimaryCard>
    </div>
  );
}
