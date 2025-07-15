import { ServerTCP } from 'modbus-serial';
import dotenv from 'dotenv';
import { createRegisterHandler } from './utils/createRegisterHandler';
import { updateState, initialState } from './utils/sensorState';

dotenv.config();

let currentState = initialState;
const getState = () => currentState;
const setState = (newState: typeof currentState) => {
  currentState = newState;
};

const updateSensorState = () => {
  const frequency = parseInt(process.env.UPDATE_FREQUENCY_MS || '100');
  currentState = updateState(currentState);
  setTimeout(updateSensorState, frequency);
};

updateSensorState();

const vectorHandlers = createRegisterHandler(getState, setState);

new ServerTCP(vectorHandlers, {
  host: process.env.MODBUS_HOST || '0.0.0.0',
  port: parseInt(process.env.MODBUS_PORT || '5020'),
  debug: process.env.NODE_ENV === 'development',
});

console.log('Sensor simulator running on port 5020');
console.log('- Base temperature: 25°C');
console.log('- Sine wave amplitude: configurable (default 10°C)');
console.log('- Random noise: ±1°C');
console.log('- Gradual drift: ±5°C over time');
console.log(`- Update frequency: ${process.env.UPDATE_FREQUENCY_MS || '100'}ms`);
