export const timescalesConfig = {
  timescales: [
    { value: '1h', label: 'Last Hour', description: 'Last 60 minutes' },
    { value: '6h', label: 'Last 6 Hours', description: 'Last 6 hours' },
    { value: '1d', label: 'Last Day', description: 'Last 24 hours' },
    { value: '7d', label: 'Last Week', description: 'Last 7 days' },
    { value: '30d', label: 'Last Month', description: 'Last 30 days' },
  ],
  aggregations: [
    { value: 'raw', label: 'Raw Data', description: 'All data points' },
    { value: '1min', label: '1 Minute', description: 'Averaged by minute' },
    { value: '5min', label: '5 Minutes', description: 'Averaged by 5 minutes' },
    { value: '15min', label: '15 Minutes', description: 'Averaged by 15 minutes' },
    { value: '1hour', label: '1 Hour', description: 'Averaged by hour' },
  ],
};
