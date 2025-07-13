import { HttpClient } from "../utils/httpClient";
import { TemperatureValidator } from "../validators/temperature";
import { ControlResponse } from "./types";

export class SensorService {
  constructor(private httpClient: HttpClient) {}

  async getSensorStatus(): Promise<any> {
    try {
      const status = await this.httpClient.get<any>("/sensor/status");

      return {
        period: status.period,
        amplitude: status.amplitude,
        running: status.running,
        baseTemperature: status.baseTemperature,
        timestamp: status.timestamp,
        sensorConnection: {
          isConnected: status.sensorConnection?.isConnected || false,
          lastFailureTime: status.sensorConnection?.lastFailureTime || null,
          lastFailureMessage:
            status.sensorConnection?.lastFailureMessage || null,
        },
      };
    } catch (error) {
      console.error("Error getting sensor status:", error);

      return {
        period: 0,
        amplitude: 0,
        running: false,
        baseTemperature: 25,
        timestamp: new Date().toISOString(),
        sensorConnection: {
          isConnected: false,
          lastFailureTime: new Date().toISOString(),
          lastFailureMessage:
            error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }

  async controlSensor(controlData: any): Promise<ControlResponse> {
    try {
      const validParams =
        TemperatureValidator.validateControlParams(controlData);

      if (Object.keys(validParams).length === 0) {
        throw new Error("No valid control parameters provided");
      }

      await this.httpClient.post("/sensor/control", validParams);

      return {
        success: true,
        message: "Control commands sent successfully",
      };
    } catch (error) {
      console.error("Error controlling sensor:", error);
      throw error;
    }
  }
}
