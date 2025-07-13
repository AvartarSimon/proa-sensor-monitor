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
