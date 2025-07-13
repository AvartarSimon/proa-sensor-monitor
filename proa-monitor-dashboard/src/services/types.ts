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
  timestamp: string;
  sensor: {
    status: 'connected' | 'disconnected';
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
  controls: SensorControlType;
}
