export interface Profile {
  name?: string;
  email: string | null;
  phone: string;
  is_active: boolean;
  is_available_today: boolean;
}
