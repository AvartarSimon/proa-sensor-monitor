import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to the sensor management API
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
      // Proxy sensor control requests to the sensor data collector
      '/sensor': {
        target: 'http://localhost:4001',
        changeOrigin: true,
        secure: false,
      },
      // Proxy health check requests
      '/health': {
        target: 'http://localhost:4001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
