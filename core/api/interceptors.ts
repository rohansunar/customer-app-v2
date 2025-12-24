import { getToken } from '../storage/secureStorage';
import { apiClient } from './client';

apiClient.interceptors.request.use(
  async (config) => {
    console.log('Interceptor triggered for URL:', config.url);
    const token = await getToken();
    console.log('Token retrieved:', token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set');
    } else {
      console.log('No token found, no header set');
    }
    console.log('Final headers:', config.headers);
    return config;
  },
  (error) => {
    console.log('Request interceptor error:', error);
    return Promise.reject(error);
  },
);
