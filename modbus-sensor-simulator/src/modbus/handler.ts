import { SensorState } from "../types/state";
import { generateTemperature } from "../core/temperature";
import { updateStateFromRegister } from "../core/stateMachine";

export const createVectorHandlers = (
  getState: () => SensorState,
  setState: (newState: SensorState) => void,
) => ({
  getHoldingRegister: (addr: number): number => {
    const state = getState();
    switch (addr) {
      case 0:
        return generateTemperature(state);
      case 1:
        return state.period;
      case 2:
        return state.amplitude;
      case 3:
        return state.running ? 1 : 0;
      default:
        return 0;
    }
  },
  setRegister: (addr: number, value: number): void => {
    const state = getState();
    const newState = updateStateFromRegister(state, addr, value);
    setState(newState);
    console.log(`Register ${addr} updated to: ${value}`);
  },
});
