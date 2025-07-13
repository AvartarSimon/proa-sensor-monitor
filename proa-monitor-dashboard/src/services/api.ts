import apiClient from './apiClient';
import {
  TemperatureResponse,
  TemperatureStats,
  SensorStatus,
  SensorControlType,
  ControlResponse,
} from './types';

// ============ Temperature APIs ============

export async function getTemperatures(
  timescale?: string,
  aggregation: string = 'raw',
  from?: string,
  to?: string,
  limit: number = 1000,
): Promise<TemperatureResponse> {
  const params = new URLSearchParams();
  if (timescale) params.append('timescale', timescale);
  if (from) params.append('from', from);
  if (to) params.append('to', to);
  params.append('aggregation', aggregation);
  params.append('limit', limit.toString());

  const res = await apiClient.get(`/api/temperatures?${params.toString()}`);
  return res.data;
}

export async function getRecentTemperatures(limit: number = 100): Promise<TemperatureResponse> {
  const res = await apiClient.get(`/api/temperatures/recent?limit=${limit}`);
  return res.data;
}

export async function getTemperatureStats(
  timescale?: string,
  from?: string,
  to?: string,
): Promise<TemperatureStats> {
  const params = new URLSearchParams();
  if (timescale) params.append('timescale', timescale);
  if (from) params.append('from', from);
  if (to) params.append('to', to);

  const res = await apiClient.get(`/api/temperatures/stats?${params.toString()}`);
  return res.data;
}

// ============ Sensor APIs ============

export async function getSensorStatus(): Promise<SensorStatus> {
  const res = await apiClient.get('/sensor/status');
  return res.data;
}

export async function controlSensor(controls: SensorControlType): Promise<ControlResponse> {
  const res = await apiClient.post('/sensor/control', controls);
  return res.data;
}

// ============ Health API ============

export async function getHealth(): Promise<any> {
  const res = await apiClient.get('/health');
  return res.data;
}
