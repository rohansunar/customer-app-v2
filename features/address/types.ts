export type Address = {
  id: string;
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
  createdAt: string;
  updatedAt: string;
};
