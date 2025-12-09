import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Loan {
  id?: string;
  amount: number;
  borrowerName: string;
  borrowerPhone: string;
  dueDate: string;
  status?: string;
  returnedDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private apiUrl = 'http://localhost:3000/loans';

  constructor(private http: HttpClient) {}

  createLoan(loan: Loan): Observable<Loan> {
    return this.http.post<Loan>(this.apiUrl, loan);
  }

  getAllLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(this.apiUrl);
  }

  getLoanById(id: string): Observable<Loan> {
    return this.http.get<Loan>(`${this.apiUrl}/${id}`);
  }

  getOverdueLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/overdue`);
  }

  getPendingLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/pending`);
  }

  getTotalLoanAmount(): Observable<{ totalAmount: number }> {
    return this.http.get<{ totalAmount: number }>(`${this.apiUrl}/total-amount`);
  }

  updateLoan(id: string, loan: Partial<Loan>): Observable<Loan> {
    return this.http.put<Loan>(`${this.apiUrl}/${id}`, loan);
  }

  markAsReturned(id: string): Observable<Loan> {
    return this.http.put<Loan>(`${this.apiUrl}/${id}/mark-returned`, {});
  }

  deleteLoan(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
