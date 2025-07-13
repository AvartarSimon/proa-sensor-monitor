import { SensorState } from "../types/state";

export const generateTemperature = (state: SensorState): number => {
  const baseTemp = 25;
  const sineWave = state.amplitude * Math.sin(state.phase);
  const noise = (Math.random() - 0.5) * 2;
  const temperature = baseTemp + sineWave + noise + state.drift;

  console.log("Current temperature: ***", temperature);
  return parseFloat(temperature.toFixed(1));
};
