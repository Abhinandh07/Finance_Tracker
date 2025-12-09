export type TransactionType = 'income' | 'expense';
export type Category = 'Income' | 'Food' | 'Transport' | 'Entertainment' | 'Utilities' | 'Other';

export interface ITransaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  category: Category;
  type: TransactionType;
}

export class Transaction implements ITransaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  category: Category;
  type: TransactionType;

  constructor(data: Omit<Transaction, 'id'>) {
    this.id = Date.now().toString();
    this.date = data.date;
    this.description = data.description;
    this.amount = data.amount;
    this.category = data.category;
    this.type = data.type;
  }
}
