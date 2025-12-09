import { Component, OnInit } from '@angular/core';
import { LoanService, Loan } from '../../services/loan.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.css'],
})
export class LoanListComponent implements OnInit {
  loans: Loan[] = [];
  loading = false;
  filterType = 'all'; // all, pending, overdue
  errorMessage = '';
  totalAmount = 0;

  constructor(private loanService: LoanService) {}

  ngOnInit() {
    this.loadLoans();
    this.loadTotalAmount();
  }

  loadLoans() {
    this.loading = true;
    this.errorMessage = '';

    if (this.filterType === 'overdue') {
      this.loanService.getOverdueLoans().subscribe({
        next: (data) => {
          this.loans = data;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load overdue loans';
          this.loading = false;
        },
      });
    } else if (this.filterType === 'pending') {
      this.loanService.getPendingLoans().subscribe({
        next: (data) => {
          this.loans = data;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load pending loans';
          this.loading = false;
        },
      });
    } else {
      this.loanService.getAllLoans().subscribe({
        next: (data) => {
          this.loans = data;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load loans';
          this.loading = false;
        },
      });
    }
  }

  loadTotalAmount() {
    this.loanService.getTotalLoanAmount().subscribe({
      next: (data) => {
        this.totalAmount = data.totalAmount;
      },
      error: (error) => {
        console.error('Failed to load total amount', error);
      },
    });
  }

  markAsReturned(id: string | undefined) {
    if (!id) return;

    if (confirm('Mark this loan as returned?')) {
      this.loanService.markAsReturned(id).subscribe({
        next: () => {
          this.loadLoans();
          this.loadTotalAmount();
        },
        error: (error) => {
          this.errorMessage = 'Failed to mark loan as returned';
        },
      });
    }
  }

  deleteLoan(id: string | undefined) {
    if (!id) return;

    if (confirm('Are you sure you want to delete this loan?')) {
      this.loanService.deleteLoan(id).subscribe({
        next: () => {
          this.loadLoans();
          this.loadTotalAmount();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete loan';
        },
      });
    }
  }

  onFilterChange(type: string) {
    this.filterType = type;
    this.loadLoans();
  }

  getStatusColor(status: string | undefined): string {
    if (status === 'returned') return 'bg-green-900 text-green-100';
    if (status === 'overdue') return 'bg-red-900 text-red-100';
    return 'bg-yellow-900 text-yellow-100';
  }

  getStatusLabel(status: string | undefined): string {
    if (status === 'returned') return '✅ Returned';
    if (status === 'overdue') return '⚠️ Overdue';
    return '⏳ Pending';
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }

  isOverdue(dueDate: string | undefined): boolean {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  }
}
