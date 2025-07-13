// Repository types
export interface TimeRange {
  from: Date;
  to: Date;
}

export interface TemperatureData {
  timestamp: string;
  value: number;
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
