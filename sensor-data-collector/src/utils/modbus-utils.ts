import ModbusRTU from 'modbus-serial';
import { type Config } from '../config';

// Pure function to create Modbus client
export const createModbusClient = (): ModbusRTU => {
  return new ModbusRTU();
};

// Pure function to connect to Modbus sensor
export const connectToModbusSensor = async (
  modbusClient: ModbusRTU,
  config: Config,
): Promise<boolean> => {
  try {
    await modbusClient.connectTCP(config.modbusHost, { port: config.modbusPort });
    modbusClient.setID(1);
    console.log(`Connected to Modbus sensor at ${config.modbusHost}:${config.modbusPort}`);
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to connect to Modbus sensor:', errorMessage);
    return false;
  }
};

// Pure function to write register
export const writeRegister = async (
  modbusClient: ModbusRTU,
  addr: number,
  value: number,
): Promise<void> => {
  try {
    await modbusClient.writeRegister(addr, value);
    console.log(`Wrote register ${addr}: ${value}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error writing register ${addr}:`, errorMessage);
    throw error;
  }
};

// Pure function to read register
export const readRegister = async (modbusClient: ModbusRTU, addr: number): Promise<number> => {
  try {
    const result = await modbusClient.readHoldingRegisters(addr, 1);
    return result.data[0];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error reading register ${addr}:`, errorMessage);
    throw error;
  }
};

// Pure function to read multiple registers
export const readRegisters = async (
  modbusClient: ModbusRTU,
  addr: number,
  count: number,
): Promise<number[]> => {
  try {
    const result = await modbusClient.readHoldingRegisters(addr, count);
    return result.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error reading registers ${addr}-${addr + count - 1}:`, errorMessage);
    throw error;
  }
};
