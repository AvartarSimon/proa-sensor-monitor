import { ServerTCP } from "modbus-serial";
import dotenv from "dotenv";

dotenv.config();
// Immutable state interface
interface SensorState {
  readonly period: number;
  readonly amplitude: number;
  readonly running: boolean;
  readonly phase: number;
  readonly time: number;
  readonly drift: number;
}

// Initial state
const initialState: SensorState = {
  period: 1000,
  amplitude: 10,
  running: true,
  phase: 0,
  time: 0,
  drift: 0,
};

// Pure function to update phase
const updatePhase = (state: SensorState): number => {
  if (!state.running) return state.phase;

  const newPhase = state.phase + (2 * Math.PI) / (state.period / 100);
  return newPhase;
};

// Pure function to update drift
const updateDrift = (state: SensorState): number => {
  const driftChange = (Math.random() - 0.5) * 0.01;
  const newDrift = state.drift + driftChange;
  return Math.max(-5, Math.min(5, newDrift));
};

// Pure function to update time
const updateTime = (state: SensorState): number => {
  return state.time + 0.1;
};

// Pure function to generate temperature
const generateTemperature = (state: SensorState): number => {
  const baseTemp = 25;
  const sineWave = state.amplitude * Math.sin(state.phase);
  const noise = (Math.random() - 0.5) * 2;
  const temperature = baseTemp + sineWave + noise + state.drift;
  console.log("Current temperature: ***", temperature);
  return parseFloat(temperature.toFixed(1));
};

// Pure function to create new state
const updateState = (currentState: SensorState): SensorState => ({
  ...currentState,
  phase: updatePhase(currentState),
  drift: updateDrift(currentState),
  time: updateTime(currentState),
});

// State management with functional updates
let currentState: SensorState = initialState;

// Update state based on environment variable
const updateSensorState = (): void => {
  const updateFrequency = parseInt(process.env.UPDATE_FREQUENCY_MS || "100");
  currentState = updateState(currentState);
  setTimeout(updateSensorState, updateFrequency);
};

// Start state updates
updateSensorState();

// Pure function to validate register values
const validateRegisterValue = (
  value: number,
  min: number,
  max: number,
): number => {
  return Math.max(min, Math.min(max, value));
};

// Pure function to update state based on register write
const updateStateFromRegister = (
  state: SensorState,
  register: number,
  value: number,
): SensorState => {
  switch (register) {
    case 1:
      return { ...state, period: validateRegisterValue(value, 100, 10000) };
    case 2:
      return { ...state, amplitude: validateRegisterValue(value, 0, 50) };
    case 3:
      return { ...state, running: value > 0 };
    default:
      return state;
  }
};

// Define the vectorRegisterHandlers (register handlers) for the Modbus server
const vectorRegisterHandlers = {
  getHoldingRegister: (addr: number): number => {
    switch (addr) {
      case 0:
        return generateTemperature(currentState);
      case 1:
        return currentState.period;
      case 2:
        return currentState.amplitude;
      case 3:
        return currentState.running ? 1 : 0;
      default:
        return 0;
    }
  },
  setRegister: (addr: number, value: number): void => {
    currentState = updateStateFromRegister(currentState, addr, value);
    console.log(`Register ${addr} updated to: ${value}`);
  },
};

// Create and start the Modbus TCP server
new ServerTCP(vectorRegisterHandlers, {
  host: process.env.MODBUS_HOST || "0.0.0.0",
  port: parseInt(process.env.MODBUS_PORT || "5020"),
  debug: process.env.NODE_ENV === "development",
});

console.log("Sensor simulator running on port 5020");
console.log("Temperature signal components:");
console.log("- Base temperature: 25°C");
console.log("- Sine wave amplitude: configurable (default 10°C)");
console.log("- Random noise: ±1°C");
console.log("- Gradual drift: ±5°C over time");
console.log(
  `- Update frequency: ${process.env.UPDATE_FREQUENCY_MS || "100"}ms`,
);
