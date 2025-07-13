import { HttpClient } from "../utils/httpClient";
import { TemperatureValidator } from "../validators/temperature";
import { SensorStatus, ControlResponse } from "./types";

export class SensorService {
  constructor(private httpClient: HttpClient) {}

  async getSensorStatus(): Promise<SensorStatus> {
    try {
      const status = {
        connection: {
          isConnected: true,
          lastFailureTime: null,
          lastFailureMessage: null,
        },
      };

      return {
        timestamp: new Date().toISOString(),
        sensor: {
          status: status.connection?.isConnected ? "connected" : "disconnected",
          lastFailureTime: status.connection?.lastFailureTime || null,
          lastFailureMessage: status.connection?.lastFailureMessage || null,
        },
      };
    } catch (error) {
      console.error("Error getting sensor status:", error);

      return {
        timestamp: new Date().toISOString(),
        sensor: {
          status: "disconnected",
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

      console.log("control sensor TODO: implement");

      return {
        success: true,
        controls: validParams,
      };
    } catch (error) {
      console.error("Error controlling sensor:", error);
      throw error;
    }
  }
}
