import { renderHook, act, waitFor } from '@testing-library/react';
import { useTemperatureChart } from '../useTemperatureChart';
import { sensorDataApi } from '../../services/sensorDataApi';

// Mock the sensorDataApi
jest.mock('../../services/sensorDataApi');
const mockedSensorDataApi = sensorDataApi as jest.Mocked<typeof sensorDataApi>;

// Mock echarts
jest.mock('echarts', () => ({
  EChartsOption: jest.fn(),
}));

describe('useTemperatureChart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockTemperatureData = {
    data: [
      { timestamp: '2024-01-01T10:00:00Z', value: 25.5 },
      { timestamp: '2024-01-01T10:01:00Z', value: 26.0 },
      { timestamp: '2024-01-01T10:02:00Z', value: 25.8 },
    ],
    meta: {
      from: '2024-01-01T10:00:00Z',
      to: '2024-01-01T11:00:00Z',
      timescale: '1h',
      aggregation: 'raw',
      totalPoints: 3,
      aggregatedPoints: 3,
    },
  };

  const mockStats = {
    stats: {
      totalReadings: 3,
      averageTemperature: 25.77,
      minTemperature: 25.5,
      maxTemperature: 26.0,
      standardDeviation: 0.25,
      temperatureRange: 0.5,
      firstReading: '2024-01-01T10:00:00Z',
      lastReading: '2024-01-01T10:02:00Z',
    },
    meta: {
      from: '2024-01-01T10:00:00Z',
      to: '2024-01-01T11:00:00Z',
      timescale: '1h',
    },
  };

  it('should initialize with default values', () => {
    mockedSensorDataApi.getTemperatures.mockResolvedValue(mockTemperatureData);
    mockedSensorDataApi.getTemperatureStats.mockResolvedValue(mockStats);

    const { result } = renderHook(() => useTemperatureChart());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.selectedTimescale).toBe('1h');
    expect(result.current.data).toEqual([]);
    expect(result.current.stats).toBeNull();
  });

  it('should fetch temperature data and stats on mount', async () => {
    mockedSensorDataApi.getTemperatures.mockResolvedValue(mockTemperatureData);
    mockedSensorDataApi.getTemperatureStats.mockResolvedValue(mockStats);

    const { result } = renderHook(() => useTemperatureChart());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedSensorDataApi.getTemperatures).toHaveBeenCalledWith('1h', 'raw');
    expect(mockedSensorDataApi.getTemperatureStats).toHaveBeenCalledWith('1h');
    expect(result.current.data).toHaveLength(3);
    expect(result.current.stats).toEqual(mockStats);
  });

  it('should handle timescale change', async () => {
    mockedSensorDataApi.getTemperatures.mockResolvedValue(mockTemperatureData);
    mockedSensorDataApi.getTemperatureStats.mockResolvedValue(mockStats);

    const { result } = renderHook(() => useTemperatureChart());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleTimescaleChange('6h');
    });

    expect(result.current.selectedTimescale).toBe('6h');
    expect(mockedSensorDataApi.getTemperatures).toHaveBeenCalledWith('6h', 'raw');
    expect(mockedSensorDataApi.getTemperatureStats).toHaveBeenCalledWith('6h');
  });

  it('should handle API errors', async () => {
    const errorMessage = 'Failed to fetch data';
    mockedSensorDataApi.getTemperatures.mockRejectedValue(new Error(errorMessage));
    mockedSensorDataApi.getTemperatureStats.mockResolvedValue(mockStats);

    const { result } = renderHook(() => useTemperatureChart());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to load temperature data');
  });

  it('should retry failed requests', async () => {
    mockedSensorDataApi.getTemperatures
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockTemperatureData);
    mockedSensorDataApi.getTemperatureStats.mockResolvedValue(mockStats);

    const { result } = renderHook(() => useTemperatureChart());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to load temperature data');

    act(() => {
      result.current.retry();
    });

    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });

    expect(result.current.data).toHaveLength(3);
  });

  it('should generate chart options correctly', async () => {
    mockedSensorDataApi.getTemperatures.mockResolvedValue(mockTemperatureData);
    mockedSensorDataApi.getTemperatureStats.mockResolvedValue(mockStats);

    const { result } = renderHook(() => useTemperatureChart());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const chartOption = result.current.getChartOption();

    expect(chartOption.title?.text).toBe('Temperature Chart (1h)');
    expect(chartOption.series).toHaveLength(1);
    expect(chartOption.series?.[0].data).toHaveLength(3);
    expect(chartOption.yAxis?.min).toBe(23); // Math.floor(25.5 - 2)
    expect(chartOption.yAxis?.max).toBe(28); // Math.ceil(26.0 + 2)
  });

  it('should provide timescales configuration', () => {
    mockedSensorDataApi.getTemperatures.mockResolvedValue(mockTemperatureData);
    mockedSensorDataApi.getTemperatureStats.mockResolvedValue(mockStats);

    const { result } = renderHook(() => useTemperatureChart());

    expect(result.current.TIMESCALES).toHaveLength(5);
    expect(result.current.TIMESCALES[0]).toEqual({
      value: '1h',
      label: 'Last Hour',
      description: 'Last 60 minutes',
    });
  });
});
