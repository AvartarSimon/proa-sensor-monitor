import { SensorState } from './sensorState';

export const updateRegisterState = (
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
