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

export interface AddressFormState {
  label: string;
  addressText: string;
  pincode: string;
  cityId: string;
  lng: number;
  lat: number;
  state: string;
}

export interface AddressMapSectionProps {
  lat: number;
  lng: number;
  onRegionChange: (region: any) => void;
}

export interface AddressTabsProps {
  label: string;
  onLabelChange: (label: string) => void;
}

export interface AddressFormInputsProps {
  addressText: string;
  onAddressTextChange: (text: string) => void;
  pincode: string;
  onPincodeChange: (text: string) => void;
  state: string;
  onStateChange: (text: string) => void;
  cityId: string;
  onCityIdChange: (cityId: string) => void;
  cities: any[];
  isCitiesLoading: boolean;
}

export interface AddressGeocodeInfoProps {
  geocodeResult: any;
  geocodeLoading: boolean;
}

export interface AddressCoordinatesDisplayProps {
  lat: number;
  lng: number;
}
