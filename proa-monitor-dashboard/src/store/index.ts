import { configureStore } from '@reduxjs/toolkit';

import leftBlocksDataReducer from './leftBlocksDataSlice';

export const store = configureStore({
  reducer: {
    leftBlocksData: leftBlocksDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
