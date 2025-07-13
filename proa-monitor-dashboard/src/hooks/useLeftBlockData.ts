import { useEffect, useState } from 'react';
import { useAppSelector } from './useAppSelector';
import {
  requestLeftBlock1,
  requestLeftBlock2,
  requestLeftBlock3,
} from '../services/leftBlocksData';

interface LeftBlockData {
  block1: any[];
  block2: any[];
  block3: any[];
  loading: {
    block1: boolean;
    block2: boolean;
    block3: boolean;
  };
}

const initialState: LeftBlockData = {
  block1: [],
  block2: [],
  block3: [],
  loading: {
    block1: false,
    block2: false,
    block3: false,
  },
};

export const useLeftBlockData = () => {
  const selectedParams = useAppSelector((state) => state.leftBlocksData.selectedParams);
  const [data, setData] = useState<LeftBlockData>(initialState);

  const fetchBlock1Data = async () => {
    try {
      setData((prev) => ({ ...prev, loading: { ...prev.loading, block1: true } }));
      const { data: responseData } = await requestLeftBlock1(selectedParams);
      setData((prev) => ({
        ...prev,
        block1: responseData,
        loading: { ...prev.loading, block1: false },
      }));
    } catch (error) {
      console.error('Failed to fetch block1 data:', error);
      setData((prev) => ({
        ...prev,
        loading: { ...prev.loading, block1: false },
      }));
    }
  };

  const fetchBlock2Data = async () => {
    try {
      setData((prev) => ({ ...prev, loading: { ...prev.loading, block2: true } }));
      const { data: responseData } = await requestLeftBlock2(selectedParams);
      setData((prev) => ({
        ...prev,
        block2: responseData,
        loading: { ...prev.loading, block2: false },
      }));
    } catch (error) {
      console.error('Failed to fetch block2 data:', error);
      setData((prev) => ({
        ...prev,
        loading: { ...prev.loading, block2: false },
      }));
    }
  };

  const fetchBlock3Data = async () => {
    try {
      setData((prev) => ({ ...prev, loading: { ...prev.loading, block3: true } }));
      const { data: responseData } = await requestLeftBlock3(selectedParams);
      setData((prev) => ({
        ...prev,
        block3: responseData,
        loading: { ...prev.loading, block3: false },
      }));
    } catch (error) {
      console.error('Failed to fetch block3 data:', error);
      setData((prev) => ({
        ...prev,
        loading: { ...prev.loading, block3: false },
      }));
    }
  };

  const fetchAllData = async () => {
    await Promise.all([fetchBlock1Data(), fetchBlock2Data(), fetchBlock3Data()]);
  };

  useEffect(() => {
    if (Object.keys(selectedParams).length > 0) {
      fetchAllData();
    }
  }, [selectedParams]);

  return {
    ...data,
    fetchBlock1Data,
    fetchBlock2Data,
    fetchBlock3Data,
    fetchAllData,
  };
};
