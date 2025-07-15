import axios from 'axios';

// Use environment variable or fallback to empty string for relative URLs
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

console.log('API_BASE_URL', '1111111==================', API_BASE_URL);
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
