import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { Address, CreateAddressData } from '../types';

/**
 * Service class for address-related API operations.
 * Follows Single Responsibility Principle by handling all address API calls.
 */
export class AddressService {
  /**
   * Get user's addresses
   */
  async getAddresses(): Promise<Address[]> {
    const response = await apiClient.get(API_ENDPOINTS.ADDRESS);
    return response.data as Address[];
  }

  /**
   * Create a new address
   */
  createAddress(data: CreateAddressData) {
    return apiClient.post(API_ENDPOINTS.ADDRESS, data);
  }

  /**
   * Update address details by ID
   */
  updateAddress(id: string, data: CreateAddressData) {
    return apiClient.put(`${API_ENDPOINTS.ADDRESS}/${id}`, data);
  }

  /**
   * Delete address by ID
   */
  deleteAddress(id: string) {
    return apiClient.delete(`${API_ENDPOINTS.ADDRESS}/${id}`);
  }

  /**
   * Set address as default by ID
   */
  setDefaultAddress(id: string) {
    return apiClient.put(`${API_ENDPOINTS.ADDRESS}/${id}/set-default`);
  }
}

export const addressService = new AddressService();
