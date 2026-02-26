export interface Transaction {
  id: string;
  type: 'positive' | 'negative';
  amount: number;
  description: string;
  date: string;
}

export interface Profile {
  name?: string;
  email: string | null;
  phone: string;
  isActive: boolean;
  walletBalance?: number;
  recentTransactions?: Transaction[];
}
