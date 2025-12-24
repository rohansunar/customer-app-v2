import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { Address } from '../types';

export const addressService = {
  /**
   * Get user's addresses
   */
  async getAddresses(): Promise<Address[]> {
    const response = await apiClient.get(API_ENDPOINTS.ADDRESS);
    return response.data;
  },

  /**
   * Create a new address
   */
  createAddress(data: {
    service_radius_m: number;
    delivery_time_msg: string;
    street: string;
    cityId: string;
    state: string;
    zipCode: string;
    country: string;
    location: {
      lat: number;
      lng: number;
    };
    address: string;
  }) {
    console.log('Create a new address', data);
    return apiClient.post(API_ENDPOINTS.ADDRESS, data);
  },

  /**
   * Update address details by ID
   */
  updateAddress(
    id: string,
    data: {
      service_radius_m: number;
      delivery_time_msg: string;
      street: string;
      cityId: string;
      state: string;
      zipCode: string;
      country: string;
      location: {
        lat: number;
        lng: number;
      };
      address: string;
    },
  ) {
    return apiClient.put(`${API_ENDPOINTS.ADDRESS}/${id}`, data);
  },

  /**
   * Delete address by ID
   */
  deleteAddress(id: string) {
    return apiClient.delete(`${API_ENDPOINTS.ADDRESS}/${id}`);
  },
};
