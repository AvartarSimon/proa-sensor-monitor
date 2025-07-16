import { renderHook, act, waitFor } from '@testing-library/react';
import { useSensorControl } from '../useSensorControl';
import { sensorDataApi } from '../../services/sensorDataApi';

// Mock the sensorDataApi
jest.mock('../../services/sensorDataApi');
const mockedSensorDataApi = sensorDataApi as jest.Mocked<typeof sensorDataApi>;

describe('useSensorControl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockSensorStatus = {
    period: 1000,
    amplitude: 10,
    running: true,
    baseTemperature: 25.0,
    timestamp: '2024-01-01T10:00:00Z',
    sensorConnection: {
      isConnected: true,
      lastFailureTime: null,
      lastFailureMessage: null,
    },
  };

  const mockControlResponse = {
    success: true,
    message: 'Sensor control updated successfully',
  };

  it('should initialize with default values', () => {
    mockedSensorDataApi.getSensorStatus.mockResolvedValue(mockSensorStatus);

    const { result } = renderHook(() => useSensorControl());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.sensorStatus).toBeNull();
    expect(result.current.controlLoading).toBe(false);
  });

  it('should fetch sensor status on mount', async () => {
    mockedSensorDataApi.getSensorStatus.mockResolvedValue(mockSensorStatus);

    const { result } = renderHook(() => useSensorControl());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedSensorDataApi.getSensorStatus).toHaveBeenCalled();
    expect(result.current.sensorStatus).toEqual(mockSensorStatus);
  });

  it('should handle sensor status fetch errors', async () => {
    const errorMessage = 'Failed to fetch sensor status';
    mockedSensorDataApi.getSensorStatus.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useSensorControl());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to load sensor status');
  });

  it('should toggle sensor status successfully', async () => {
    mockedSensorDataApi.getSensorStatus.mockResolvedValue(mockSensorStatus);
    mockedSensorDataApi.controlSensor.mockResolvedValue(mockControlResponse);

    const { result } = renderHook(() => useSensorControl());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let toggleResult;
    act(() => {
      toggleResult = result.current.toggleSensor();
    });

    await waitFor(() => {
      expect(result.current.controlLoading).toBe(false);
    });

    expect(mockedSensorDataApi.controlSensor).toHaveBeenCalledWith({ status: false });
    expect(toggleResult).resolves.toEqual(mockControlResponse);
  });

  it('should update period successfully', async () => {
    mockedSensorDataApi.getSensorStatus.mockResolvedValue(mockSensorStatus);
    mockedSensorDataApi.controlSensor.mockResolvedValue(mockControlResponse);

    const { result } = renderHook(() => useSensorControl());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let updateResult;
    act(() => {
      updateResult = result.current.updatePeriod(2000);
    });

    await waitFor(() => {
      expect(result.current.controlLoading).toBe(false);
    });

    expect(mockedSensorDataApi.controlSensor).toHaveBeenCalledWith({ period: 2000 });
    expect(updateResult).resolves.toEqual(mockControlResponse);
  });

  it('should update amplitude successfully', async () => {
    mockedSensorDataApi.getSensorStatus.mockResolvedValue(mockSensorStatus);
    mockedSensorDataApi.controlSensor.mockResolvedValue(mockControlResponse);

    const { result } = renderHook(() => useSensorControl());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let updateResult;
    act(() => {
      updateResult = result.current.updateAmplitude(20);
    });

    await waitFor(() => {
      expect(result.current.controlLoading).toBe(false);
    });

    expect(mockedSensorDataApi.controlSensor).toHaveBeenCalledWith({ amplitude: 20 });
    expect(updateResult).resolves.toEqual(mockControlResponse);
  });

  it('should handle control errors', async () => {
    mockedSensorDataApi.getSensorStatus.mockResolvedValue(mockSensorStatus);
    const errorResponse = { success: false, message: 'Control failed' };
    mockedSensorDataApi.controlSensor.mockResolvedValue(errorResponse);

    const { result } = renderHook(() => useSensorControl());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let updateResult;
    act(() => {
      updateResult = result.current.updatePeriod(2000);
    });

    await waitFor(() => {
      expect(result.current.controlLoading).toBe(false);
    });

    expect(updateResult).resolves.toEqual(errorResponse);
  });

  it('should handle API exceptions', async () => {
    mockedSensorDataApi.getSensorStatus.mockResolvedValue(mockSensorStatus);
    mockedSensorDataApi.controlSensor.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useSensorControl());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let updateResult;
    act(() => {
      updateResult = result.current.updatePeriod(2000);
    });

    await waitFor(() => {
      expect(result.current.controlLoading).toBe(false);
    });

    expect(updateResult).resolves.toEqual({
      success: false,
      message: 'Failed to control sensor',
    });
  });

  it('should refresh status after successful control', async () => {
    mockedSensorDataApi.getSensorStatus.mockResolvedValue(mockSensorStatus);
    mockedSensorDataApi.controlSensor.mockResolvedValue(mockControlResponse);

    const { result } = renderHook(() => useSensorControl());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.updatePeriod(2000);
    });

    await waitFor(() => {
      expect(result.current.controlLoading).toBe(false);
    });

    // Should call getSensorStatus twice: once on mount, once after control
    expect(mockedSensorDataApi.getSensorStatus).toHaveBeenCalledTimes(2);
  });

  it('should not toggle sensor when status is null', async () => {
    mockedSensorDataApi.getSensorStatus.mockRejectedValue(new Error('No sensor found'));

    const { result } = renderHook(() => useSensorControl());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let toggleResult;
    act(() => {
      toggleResult = result.current.toggleSensor();
    });

    expect(toggleResult).toBeUndefined();
    expect(mockedSensorDataApi.controlSensor).not.toHaveBeenCalled();
  });
});
