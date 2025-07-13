import { SensorState } from "../types/state";

export const updatePhase = (state: SensorState): number => {
  if (!state.running) return state.phase;
  return state.phase + (2 * Math.PI) / (state.period / 100);
};

export const updateDrift = (state: SensorState): number => {
  const driftChange = (Math.random() - 0.5) * 0.01;
  return Math.max(-5, Math.min(5, state.drift + driftChange));
};

export const updateTime = (state: SensorState): number => state.time + 0.1;

export const updateState = (state: SensorState): SensorState => ({
  ...state,
  phase: updatePhase(state),
  drift: updateDrift(state),
  time: updateTime(state),
});

export const updateStateFromRegister = (
  state: SensorState,
  register: number,
  value: number,
): SensorState => {
  const validate = (val: number, min: number, max: number): number =>
    Math.max(min, Math.min(max, val));

  switch (register) {
    case 1:
      return { ...state, period: validate(value, 100, 10000) };
    case 2:
      return { ...state, amplitude: validate(value, 0, 50) };
    case 3:
      return { ...state, running: value > 0 };
    default:
      return state;
  }
};
