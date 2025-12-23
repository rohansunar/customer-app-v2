import { getToken } from '@/core/storage/secureStorage';
import axios from 'axios';
import { ENV } from '../config/env';

// Create axios instance
export const apiClient = axios.create({
  baseURL: ENV.API_URL,
  timeout: 10000,
});

// Set up interceptors
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
