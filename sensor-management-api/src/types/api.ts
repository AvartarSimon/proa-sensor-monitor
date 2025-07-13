// Shared API types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  services: {
    database: string;
    sensorControl: string;
  };
}
