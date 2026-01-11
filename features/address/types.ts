export type Address = {
  id: string;
  label: string;
  address: string;
  pincode: string;
  city: {
    name: string;
  };
  isDefault: boolean;
};

export type CreateAddressData = Omit<Address, 'id'>;

export interface AddressFormProps {
  address?: Address;
  onSave: (data: CreateAddressData) => void;
  onCancel: () => void;
  isPending: boolean;
}
