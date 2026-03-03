import { getToken } from '../storage/secureStorage';
import { apiClient } from './client';

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('No token found, no header set');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// This File codes are not working on import
// Check lately
