import axios from 'axios';

// Use environment variable or fallback to empty string for relative URLs
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types for API responses
export interface TemperatureData {
  timestamp: string;
  value: number;
}
export interface TemperatureResponse {
  data: TemperatureData[];
  meta: {
    from: string;
    to: string;
    timescale: string;
    aggregation: string;
    totalPoints: number;
    aggregatedPoints: number;
  };
}

export interface TemperatureStats {
  stats: {
    totalReadings: number;
    averageTemperature: number;
    minTemperature: number;
    maxTemperature: number;
    standardDeviation: number;
    temperatureRange: number;
    firstReading: string;
    lastReading: string;
  };
  meta: {
    from: string;
    to: string;
    timescale: string;
  };
}
export interface SensorStatus {
  period: number;
  amplitude: number;
  running: boolean;
  baseTemperature: number;
  timestamp: string;
  sensorConnection: {
    isConnected: boolean;
    lastFailureTime: string | null;
    lastFailureMessage: string | null;
  };
}

export interface SensorControlType {
  period?: number;
  amplitude?: number;
  status?: boolean;
}

export interface ControlResponse {
  success: boolean;
  message: string;
}

// API functions
export const sensorDataApi = {
  // Get temperature data with timescale and aggregation
  getTemperatures: async (
    timescale?: string,
    aggregation: string = 'raw',
    from?: string,
    to?: string,
    limit: number = 1000,
  ): Promise<TemperatureResponse> => {
    const params = new URLSearchParams();
    if (timescale) params.append('timescale', timescale);
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    params.append('aggregation', aggregation);
    params.append('limit', limit.toString());

    const response = await apiClient.get(`/api/temperatures?${params.toString()}`);
    return response.data;
  },

  // Get temperature statistics
  getTemperatureStats: async (
    timescale?: string,
    from?: string,
    to?: string,
  ): Promise<TemperatureStats> => {
    const params = new URLSearchParams();
    if (timescale) params.append('timescale', timescale);
    if (from) params.append('from', from);
    if (to) params.append('to', to);

    const response = await apiClient.get(`/api/temperatures/stats?${params.toString()}`);
    return response.data;
  },

  // Get recent temperature data
  getRecentTemperatures: async (limit: number = 100): Promise<TemperatureResponse> => {
    const response = await apiClient.get(`/api/temperatures/recent?limit=${limit}`);
    return response.data;
  },

  // Get sensor status
  getSensorStatus: async (): Promise<SensorStatus> => {
    const response = await apiClient.get('/sensor/status');
    return response.data;
  },

  // Control sensor
  controlSensor: async (controls: SensorControlType): Promise<ControlResponse> => {
    const response = await apiClient.post('/sensor/control', controls);
    return response.data;
  },

  // Health check
  getHealth: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

export default sensorDataApi;
