import { useEffect, useState } from 'react';

import { MaximizeModal } from '../../../components/MaximizeModal';
import { PrimaryCard } from '../../../components/PrimaryCard';
import type { ECOption } from '../../../components/SuperEChart';
import { linearGradient, SuperEChart } from '../../../components/SuperEChart';
import { formatNumber, toAdaptedPx } from '../../../utils';

import './Block2.css';

interface HumidityMetric {
  num: number;
  unit: string;
  label: string;
  chart: {
    value1: number;
    chart1: number;
    value2: number;
    chart2: number;
    value3: number;
    chart3: number;
  };
}

export default function Block2() {
  const [activeCard, setActiveCard] = useState<string>();
  const [data, setData] = useState<HumidityMetric[]>([]);
  const [open, setOpen] = useState(false);
  const activeItem = data.find((el) => el.label === activeCard)?.chart || {
    value1: 0,
    chart1: 0,
    value2: 0,
    chart2: 0,
    value3: 0,
    chart3: 0,
  };

  useEffect(() => {
    const list: HumidityMetric[] = [
      {
        num: ~~(Math.random() * 30 + 40), // 40-70% humidity
        unit: '%',
        label: 'Current Humidity',
        chart: {
          value1: ~~(Math.random() * 15 + 35), // 35-50% morning
          chart1: ~~(Math.random() * 90 + 10),
          value2: ~~(Math.random() * 20 + 40), // 40-60% afternoon
          chart2: ~~(Math.random() * 90 + 10),
          value3: ~~(Math.random() * 25 + 45), // 45-70% evening
          chart3: ~~(Math.random() * 90 + 10),
        },
      },
      {
        num: ~~(Math.random() * 20 + 25), // 25-45°C temperature
        unit: '°C',
        label: 'Temperature',
        chart: {
          value1: ~~(Math.random() * 10 + 20), // 20-30°C morning
          chart1: ~~(Math.random() * 90 + 10),
          value2: ~~(Math.random() * 15 + 25), // 25-40°C afternoon
          chart2: ~~(Math.random() * 90 + 10),
          value3: ~~(Math.random() * 8 + 22), // 22-30°C evening
          chart3: ~~(Math.random() * 90 + 10),
        },
      },
      {
        num: ~~(Math.random() * 15 + 10), // 10-25 m/s wind speed
        unit: 'm/s',
        label: 'Wind Speed',
        chart: {
          value1: ~~(Math.random() * 5 + 5), // 5-10 m/s morning
          chart1: ~~(Math.random() * 90 + 10),
          value2: ~~(Math.random() * 8 + 8), // 8-16 m/s afternoon
          chart2: ~~(Math.random() * 90 + 10),
          value3: ~~(Math.random() * 6 + 6), // 6-12 m/s evening
          chart3: ~~(Math.random() * 90 + 10),
        },
      },
    ];

    setData(list);
    setActiveCard(list[0].label);
  }, []);

  const content = (
    <>
      <div className="block2__card-list">
        {data.map((el) => {
          return (
            <MiniCard
              {...el}
              key={el.label}
              isActive={el.label === activeCard}
              onClick={() => setActiveCard(el.label)}
            />
          );
        })}
      </div>
      <div className="block2__chart">
        <div className="block2__chart-item">
          <SuperEChart
            key="block2-chart1"
            width={134}
            height={100}
            options={getChart(activeItem.chart1)}
          />
          <div className="block2__chart-title">Morning</div>
          <div>
            <span className="block2__chart-value">{activeItem.value1}</span>
            <span className="block2__chart-unit">
              {data.find((el) => el.label === activeCard)?.unit}
            </span>
          </div>
        </div>
        <div className="block2__chart-item">
          <SuperEChart
            key="block2-chart2"
            width={134}
            height={100}
            options={getChart(activeItem.chart2)}
          />
          <div className="block2__chart-title">Afternoon</div>
          <div>
            <span className="block2__chart-value">{activeItem.value2}</span>
            <span className="block2__chart-unit">
              {data.find((el) => el.label === activeCard)?.unit}
            </span>
          </div>
        </div>
        <div className="block2__chart-item">
          <SuperEChart
            key="block2-chart3"
            width={150}
            height={100}
            options={getChart(activeItem.chart3)}
          />
          <div className="block2__chart-title">Evening</div>
          <div>
            <span className="block2__chart-value">{activeItem.value3}</span>
            <span className="block2__chart-unit">
              {data.find((el) => el.label === activeCard)?.unit}
            </span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <PrimaryCard
      className="block2"
      title={
        <div className="block2__title">
          <span>Real-time Humidity</span>
        </div>
      }
    >
      {content}
      <div className="block2__date">
        {new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })}
      </div>
      <MaximizeModal
        width={toAdaptedPx(925)}
        open={open}
        onCancel={() => setOpen(false)}
        title="Real-time Humidity"
      >
        <div className="block2__modal-content">{content}</div>
      </MaximizeModal>
    </PrimaryCard>
  );
}

function getChart(data: number, zoom: number = 1): ECOption {
  const currentAxisLineRatio: number = data / 100;
  return {
    series: [
      {
        type: 'gauge',
        center: ['50%', '60%'],
        startAngle: 210,
        endAngle: -30,
        min: 0,
        max: 100,
        radius: toAdaptedPx(zoom * 55),
        splitNumber: 30,
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: {
          show: true,
          lineStyle: {
            width: toAdaptedPx(zoom * 12),
            color: [
              ...new Array(20).fill(0).map((_, i) => {
                return [
                  (currentAxisLineRatio / 20) * i,
                  `rgba(91, 176, 255, ${0.01 + 0.0495 * i})`,
                ] as [number, string];
              }),
              [1, 'rgba(0,0,0,0.15)'] as [number, string],
            ],
          },
        },
        splitLine: {
          show: true,
          length: toAdaptedPx(zoom * 12),
          distance: toAdaptedPx(zoom * -12),
          lineStyle: {
            width: toAdaptedPx(zoom * 2),
            color: '#121618',
          },
        },
        pointer: {
          width: toAdaptedPx(zoom * 6),
          itemStyle: {
            color: new linearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#fff' },
              { offset: 1, color: 'rgba(91, 176, 255, 1)' },
            ]),
          },
        },
        detail: {
          fontSize: toAdaptedPx(zoom * 14),
          lineHeight: toAdaptedPx(zoom * 20),
          color: '#fff',
          offsetCenter: [0, '35%'],
          formatter: `{value}%`,
        },
        data: [data],
      },
    ],
  };
}

function MiniCard(props: {
  num: number;
  unit: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}) {
  const { num, unit, label, isActive = false, onClick } = props;

  return (
    <div className="mini-card" onClick={onClick}>
      <div className="mini-card__line"></div>
      <div className={`mini-card__content ${isActive ? 'mini-card__content--active' : ''}`}>
        <div>
          <div className="mini-card__num">{formatNumber(num, 0)}</div>
          <div className="mini-card__unit">{unit}</div>
        </div>
        <div>
          <div className="mini-card__label">{label}</div>
        </div>
      </div>
    </div>
  );
}
