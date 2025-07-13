// Temperature service types
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

export interface TemperatureQueryParams {
  from?: string;
  to?: string;
  timescale?: string;
  aggregation?: string;
  limit?: string;
}

export interface StatsQueryParams {
  from?: string;
  to?: string;
  timescale?: string;
}

// Sensor service types
export interface SensorControlParams {
  period?: number;
  amplitude?: number;
  status?: boolean;
}

export interface SensorStatus {
  timestamp: string;
  sensor: {
    status: "connected" | "disconnected";
    lastFailureTime: string | null;
    lastFailureMessage: string | null;
  };
}

export interface ControlResponse {
  success: boolean;
  controls: SensorControlParams;
}
