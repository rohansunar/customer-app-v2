export type Address = {
  id: string;
  service_radius_m: number;
  delivery_time_msg?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  location?: {
    lat: number;
    lng: number;
  };
  address: string;
  createdAt: string;
};

export interface AddressFormProps {
  address?: Address;
  onSave: (data: {
    service_radius_m: number;
    delivery_time_msg?: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    location: {
      lat: number;
      lng: number;
    };
    address: string;
  }) => void;
  onDelete?: () => void;
  onCancel: () => void;
  isPending: boolean;
}