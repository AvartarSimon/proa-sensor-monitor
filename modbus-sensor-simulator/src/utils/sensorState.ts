export interface SensorState {
  readonly period: number;
  readonly amplitude: number;
  readonly running: boolean;
  readonly phase: number;
  readonly time: number;
  readonly drift: number;
}

export const initialState: SensorState = {
  period: 1000,
  amplitude: 10,
  running: true,
  phase: 0,
  time: 0,
  drift: 0,
};
const updatePhase = (state: SensorState): number => {
  if (!state.running) return state.phase;
  return state.phase + (2 * Math.PI) / (state.period / 100);
};

const updateDrift = (state: SensorState): number => {
  const driftChange = (Math.random() - 0.5) * 0.01;
  return Math.max(-5, Math.min(5, state.drift + driftChange));
};

const updateTime = (state: SensorState): number => state.time + 0.1;

export const updateState = (state: SensorState): SensorState => ({
  ...state,
  phase: updatePhase(state),
  drift: updateDrift(state),
  time: updateTime(state),
});
