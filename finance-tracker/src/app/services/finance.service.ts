import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Transaction, TransactionType } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private apiUrl = this.getApiUrl() + '/transactions';
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  public transactions$ = this.transactionsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadTransactions();
  }

  private getApiUrl(): string {
    // For local development
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    }
    // For production - replace with your Render/deployed backend URL
    return 'https://your-backend-url.onrender.com';
  }

  public loadTransactions(): void {
    this.http.get<Transaction[]>(this.apiUrl).subscribe({
      next: (transactions) => {
        this.transactionsSubject.next(transactions);
      },
      error: (err: any) => {
        console.error('Error loading transactions:', err);
      }
    });
  }

  getTransactions(): Observable<Transaction[]> {
    return this.transactions$;
  }

  addTransaction(transaction: Omit<Transaction, 'id'>): Observable<Transaction> {
    const payload = {
      ...transaction,
      date: (transaction.date instanceof Date) 
        ? transaction.date.toISOString().split('T')[0] 
        : transaction.date
    };
    console.log('Sending transaction payload:', payload);
    return this.http.post<Transaction>(this.apiUrl, payload).pipe(
      tap(newTransaction => {
        console.log('Transaction added successfully:', newTransaction);
        const currentTransactions = this.transactionsSubject.getValue();
        this.transactionsSubject.next([...currentTransactions, newTransaction]);
      })
    );
  }

  updateTransaction(id: string, updates: Partial<Transaction>): Observable<Transaction> {
    const payload = {
      ...updates,
      date: updates.date instanceof Date 
        ? updates.date.toISOString().split('T')[0] 
        : updates.date
    };
    return this.http.put<Transaction>(`${this.apiUrl}/${id}`, payload).pipe(
      tap(updatedTransaction => {
        const currentTransactions = this.transactionsSubject.getValue();
        const index = currentTransactions.findIndex(t => t.id === id);
        if (index > -1) {
          const updatedTransactions = [...currentTransactions];
          updatedTransactions[index] = updatedTransaction;
          this.transactionsSubject.next(updatedTransactions);
        }
      })
    );
  }

  deleteTransaction(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentTransactions = this.transactionsSubject.getValue();
        this.transactionsSubject.next(currentTransactions.filter(t => t.id !== id));
      })
    );
  }

  getTotalIncome(): number {
    const transactions = this.transactionsSubject.getValue();
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getTotalExpenses(): number {
    const transactions = this.transactionsSubject.getValue();
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getBalance(): number {
    return this.getTotalIncome() - this.getTotalExpenses();
  }

  getTransactionsByCategory(category: string): Transaction[] {
    const transactions = this.transactionsSubject.getValue();
    return transactions.filter(t => t.category === category);
  }

  getMonthlyTransactions(year: number, month: number): Transaction[] {
    const transactions = this.transactionsSubject.getValue();
    return transactions.filter(t => {
      const transDate = new Date(t.date);
      return transDate.getFullYear() === year && transDate.getMonth() === month;
    });
  }

  getSummary(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/summary`);
  }

  getBudget(): Observable<{ amount: number }> {
    return this.http.get<{ amount: number }>(`${this.apiUrl}/budget`);
  }

  setBudget(amount: number): Observable<{ amount: number }> {
    return this.http.post<{ amount: number }>(`${this.apiUrl}/budget`, { amount });
  }
}
