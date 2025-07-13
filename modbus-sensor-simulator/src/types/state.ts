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
