import ModbusRTU from 'modbus-serial';
import {
  writeRegister,
  readRegister,
  readRegisters,
  createModbusClient,
  connectToModbusSensor,
} from '../../utils/modbus-utils';
import { createConfig } from '../../config';
// Sensor control interface
export interface SensorControl {
  period?: number;
  amplitude?: number;
  status?: boolean;
}

// Sensor status interface
export interface SensorStatus {
  readonly period: number;
  readonly amplitude: number;
  readonly running: boolean;
  readonly baseTemperature: number;
  readonly timestamp: Date;
}

export interface SensorTemperature {
  readonly temperature: number;
  readonly timestamp: Date;
}

// Sensor service class
export class SensorService {
  constructor(private modbusClient: ModbusRTU) {}

  // Control sensor parameters
  async controlSensor(control: SensorControl): Promise<void> {
    const { period, amplitude, status } = control;

    if (period !== undefined) {
      await writeRegister(this.modbusClient, 1, period);
    }
    if (amplitude !== undefined) {
      await writeRegister(this.modbusClient, 2, amplitude);
    }
    if (status !== undefined) {
      await writeRegister(this.modbusClient, 3, status ? 1 : 0);
    }
  }

  // Get current sensor status
  async getSensorStatus(): Promise<SensorStatus> {
    const registers = await readRegisters(this.modbusClient, 0, 4);

    return {
      period: registers[1],
      amplitude: registers[2],
      running: registers[3] > 0 ? true : false,
      baseTemperature: 25,
      timestamp: new Date(),
    };
  }

  // Read sensor temperature data (API interface)
  async readSensorTemperatureData(): Promise<SensorTemperature> {
    const temperature = await readRegister(this.modbusClient, 0);
    return {
      temperature,
      timestamp: new Date(),
    };
  }

  // Test connection to sensor
  async testConnection(): Promise<boolean> {
    try {
      await this.modbusClient.readHoldingRegisters(0, 1);
      return true;
    } catch (error) {
      console.error('Sensor connection test failed:', error);
      return false;
    }
  }

  async reconnectModbus(): Promise<boolean> {
    // Replace the modbusClient with a new one and reconnect
    this.modbusClient = createModbusClient();
    const config = createConfig();
    return connectToModbusSensor(this.modbusClient, config);
  }
}
