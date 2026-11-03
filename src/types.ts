export type AccountType = 'card' | 'cash';
export type TransactionType = 'expense' | 'deposit';
export type CardColor = 'navy' | 'slate' | 'emerald' | 'purple' | 'rose' | 'amber';

/** All amounts are stored in cents (integers) to avoid rounding errors. */
export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string; // YYYY-MM-DD
  description: string;
  createdAt: number;
}

export interface Account {
  id: string;
  type: AccountType;
  name: string;
  lastDigits?: string;
  color: CardColor;
  initialBalance: number;
  transactions: Transaction[];
  createdAt: number;
}

export interface Wallet {
  id: string;
  name: string;
  accounts: Account[];
  createdAt: number;
}
