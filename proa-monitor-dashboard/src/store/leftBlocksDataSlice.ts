import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface LeftBlocksDataState {
  selected: any[];
  selectedParams: Record<string, any>;
  treeData: any[];
  serverTime: number;
  loading: {
    treeData: boolean;
    serverTime: boolean;
  };
}

const initialState: LeftBlocksDataState = {
  selected: [],
  selectedParams: {},
  treeData: [],
  serverTime: Date.now(),
  loading: {
    treeData: false,
    serverTime: false,
  },
};

const leftBlocksDataSlice = createSlice({
  name: 'leftBlocksData',
  initialState,
  reducers: {
    setSelected: (state, action: PayloadAction<any[]>) => {
      state.selected = action.payload;
      // Update selectedParams based on selected
      const obj: Record<string, any> = {};
      if (action.payload[0]) obj.areaCode = action.payload[0];
      if (action.payload[1]) obj.streetCode = action.payload[1];
      if (action.payload[2]) obj.projectCode = action.payload[2];
      state.selectedParams = obj;
    },
    setSelectedParams: (state, action: PayloadAction<Record<string, any>>) => {
      state.selectedParams = action.payload;
    },
    setTreeData: (state, action: PayloadAction<any[]>) => {
      state.treeData = action.payload;
    },
    setServerTime: (state, action: PayloadAction<number>) => {
      state.serverTime = action.payload;
    },
    setTreeDataLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.treeData = action.payload;
    },
    setServerTimeLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.serverTime = action.payload;
    },
  },
});

export const {
  setSelected,
  setSelectedParams,
  setTreeData,
  setServerTime,
  setTreeDataLoading,
  setServerTimeLoading,
} = leftBlocksDataSlice.actions;
export default leftBlocksDataSlice.reducer;
