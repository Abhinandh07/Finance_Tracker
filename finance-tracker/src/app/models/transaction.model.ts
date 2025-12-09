export type TransactionType = 'income' | 'expense';
export type Category = 'Income' | 'Food' | 'Transport' | 'Entertainment' | 'Utilities' | 'Other';

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  category: Category;
  type: TransactionType;
}
