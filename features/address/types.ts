import { City } from '../city/services/cityService';

export type Address = {
  id: string;
  label: string;
  address: string;
  pincode: string;
  city: City;
  location: {
    lng: number;
    lat: number;
  };
  isDefault: boolean;
};

export type CreateAddressData = {
  label: string;
  address: string;
  pincode: string;
  cityId: string;
  location: {
    lng: number;
    lat: number;
  };
  isDefault?: boolean;
};

export interface AddressFormProps {
  address?: Address;
  onSave: (data: CreateAddressData) => void;
  onCancel: () => void;
  isPending: boolean;
}
