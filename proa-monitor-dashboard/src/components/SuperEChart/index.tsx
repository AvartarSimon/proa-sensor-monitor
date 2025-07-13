import { useSize } from 'ahooks';
import { Lines3DChart, Map3DChart, Scatter3DChart } from 'echarts-gl/charts';
import { Geo3DComponent } from 'echarts-gl/components';
import type {
  BarSeriesOption,
  CustomSeriesOption,
  GaugeSeriesOption,
  LineSeriesOption,
  PictorialBarSeriesOption,
  PieSeriesOption,
  SankeySeriesOption,
  ScatterSeriesOption,
} from 'echarts/charts';
import {
  BarChart,
  CustomChart,
  GaugeChart,
  LineChart,
  PictorialBarChart,
  PieChart,
  SankeyChart,
  ScatterChart,
} from 'echarts/charts';
import type {
  GraphicComponentOption,
  GridComponentOption,
  LegendComponentOption,
  PolarComponentOption,
  TitleComponentOption,
  TooltipComponentOption,
} from 'echarts/components';
import {
  DataZoomComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  PolarComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { toAdaptedPx } from '../../utils';
import { Empty } from '../Empty';

import baseOptions from './baseOptions';
import './SuperEChart.css';
import customThemeJSON from './theme.json';

export type EChartInstance = echarts.ECharts;
export const linearGradient = echarts.graphic.LinearGradient;

// Series type definitions end with SeriesOption
// Component type definitions end with ComponentOption
// Use ComposeOption to combine an Option type with only required components and charts
export type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | PieSeriesOption
  | GaugeSeriesOption
  | ScatterSeriesOption
  | PictorialBarSeriesOption
  | SankeySeriesOption
  | CustomSeriesOption
  | TitleComponentOption
  | GridComponentOption
  | PolarComponentOption
  | TooltipComponentOption
  | GraphicComponentOption
  | LegendComponentOption
>;

// ECharts components loaded on demand, register required components
echarts.use([
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  GaugeChart,
  PictorialBarChart,
  SankeyChart,
  CustomChart,
  TitleComponent,
  GridComponent,
  PolarComponent, // Polar coordinate system
  TooltipComponent,
  DataZoomComponent,
  LegendComponent,
  GraphicComponent,
  CanvasRenderer,
  LabelLayout,
  Lines3DChart,
  Scatter3DChart,
  Geo3DComponent,
  Map3DChart,
]);

// Custom ECharts theme
echarts.registerTheme('myTheme', customThemeJSON);

type AutoAction = {
  type: 'select' | 'highlight';
  /** Carousel interval in milliseconds */
  interval: number;
  /** Used to mark the timer, must be unique */
  timerFlag: string;
};

export type SuperEChartProps = {
  /** Chart container width */
  width?: number;
  /** Chart container height */
  height?: number;
  /** Chart configuration */
  options: ECOption & {
    /** Used to mark whether the chart is empty, specific judgment logic is implemented by the user */
    empty?: boolean;
  };
  /** Chart automatic carousel configuration */
  autoAction?: AutoAction;
  /** Whether to merge the configuration information of the last rendered chart when updating the chart configuration information. Default false */
  mergeOptions?: boolean;
  setInstance?: (EChartInstance) => void;
  [key: string]: any;
};

const autoActionTimer: Record<string, number> = {};

export function SuperEChart(props: SuperEChartProps) {
  const {
    width,
    height,
    options,
    autoAction,
    setInstance,
    mergeOptions: __mergeOptions = false,
    ...restProps
  } = props;

  const isEmpty = !!options.empty;
  const mergeOptions = autoAction ? true : __mergeOptions;

  const [chartInstance, setChartInstance] = useState<EChartInstance | null>(null);
  const pageSize = useSize(document.body);

  const chartOptions = useMemo(() => {
    let temp = options;

    if (autoAction) {
      // Carousel chart, disable chart mouse interaction
      if (Array.isArray(temp.series) && temp.series?.length !== 0) {
        temp.series[0].silent = true;
      }
    }

    return baseOptions.merge(temp);
  }, [autoAction, options]);

  if (!Array.isArray(chartOptions?.series)) {
    throw new Error('EChart series must be an array');
  }

  if (chartOptions?.series?.length === 0) {
    throw new Error('EChart series can not be an empty array');
  }

  const chartType = chartOptions.series[0].type;

  // Currently only applies to carousel effect for pie chart
  const autoActionHandler = useCallback(() => {
    if (isEmpty) return;
    if (!autoAction?.type) return;
    if (!chartInstance) return;
    if (chartType !== 'pie') return;

    const reverseTypeMap = {
      select: 'unselect',
      highlight: 'downplay',
    };

    const dataLength =
      Array.isArray(chartOptions.series) && chartOptions.series.length !== 0
        ? (chartOptions.series[0].data as any[]).length || 0
        : 0; // Data length
    let actionItemIndex = 0; // Current active data index

    chartInstance.dispatchAction({
      type: autoAction.type,
      seriesIndex: 0,
      dataIndex: actionItemIndex,
    });

    window.clearInterval(autoActionTimer[autoAction.timerFlag]);
    autoActionTimer[autoAction.timerFlag] = window.setInterval(() => {
      // Perform reverse operation on the previous element
      chartInstance.dispatchAction({
        type: reverseTypeMap[autoAction.type],
        seriesIndex: 0,
      });

      setTimeout(() => {
        if (actionItemIndex < dataLength - 1) {
          actionItemIndex += 1;
        } else {
          actionItemIndex = 0;
        }

        // Perform forward operation on the current element
        chartInstance.dispatchAction({
          type: autoAction.type,
          seriesIndex: 0,
          dataIndex: actionItemIndex,
        });
      }, 200);
    }, autoAction.interval);
  }, [isEmpty, autoAction, chartInstance, chartOptions.series, chartType]);

  const [dom, setDom] = useState<HTMLDivElement | null>(null);
  const domRef = useRef(dom);

  const renderChart = useCallback(() => {
    if (isEmpty) return;
    if (!dom) return;
    let instance = chartInstance;

    // If chart instance does not exist or dom changes, reinit chart
    if (!instance || domRef.current !== dom) {
      instance = echarts.init(dom, 'myTheme');
      setChartInstance(instance);
      if (setInstance) setInstance(instance);
    }

    domRef.current = dom;
    instance.setOption(
      chartOptions,
      mergeOptions ? {} : { notMerge: true, lazyUpdate: true, silent: true },
    );
    window.setTimeout(() => {
      instance?.resize();
    }, 1000); // Set 1 second drawing delay
  }, [isEmpty, dom, chartInstance, chartOptions, setInstance, mergeOptions]);

  useEffect(() => renderChart(), [renderChart, pageSize]);
  useEffect(() => autoActionHandler(), [autoActionHandler]);
  useEffect(() => {
    return () => {
      if (autoAction) {
        window.clearInterval(autoActionTimer[autoAction.timerFlag]);
      }
      chartInstance?.dispose();
    };
  }, [chartInstance, autoAction]);

  let realWidth = typeof width === 'number' ? toAdaptedPx(width) : width;
  let realHeight = typeof height === 'number' ? toAdaptedPx(height) : height;

  return isEmpty ? (
    <Empty imageWidth={toAdaptedPx(120)} style={{ height: realHeight }} />
  ) : (
    <div
      ref={setDom}
      style={{ width: realWidth, height: realHeight }}
      className="super-echart"
      {...restProps}
    />
  );
}
