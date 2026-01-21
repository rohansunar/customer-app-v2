
export type Address = {
  id: string;
  label: string;
  address: string;
  pincode: string;
  location: {
    id: string;
    name: string;
  };
  lng: number;
  lat: number;
  isDefault: boolean;
};

export type CreateAddressData = {
  label: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
  lng: number;
  lat: number;
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
  city: string;
  lng: number;
  lat: number;
  state: string;
}

export interface AddressMapSectionProps {
  lat: number;
  lng: number;
  onRegionChangeComplete: (region: any) => void;
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
}

export interface AddressGeocodeInfoProps {
  geocodeResult: any;
  geocodeLoading: boolean;
}

export interface AddressCoordinatesDisplayProps {
  lat: number;
  lng: number;
}
