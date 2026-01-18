type Distance = {
  value: number;
  unit: string;
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  images?: string[];
  distance: Distance
};
