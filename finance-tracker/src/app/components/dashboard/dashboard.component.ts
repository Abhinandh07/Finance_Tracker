import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../../services/finance.service';
import { Transaction } from '../../models/transaction.model';
import { TransactionListComponent } from '../transaction-list/transaction-list.component';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
import { CategoryBreakdownComponent } from '../category-breakdown/category-breakdown.component';
import { MonthlySummaryComponent } from '../monthly-summary/monthly-summary.component';
import { BudgetGauge } from '../../budget-gauge/budget-gauge';
import { LoanFormComponent } from '../loan-form/loan-form.component';
import { LoanListComponent } from '../loan-list/loan-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TransactionListComponent,
    TransactionFormComponent,
    CategoryBreakdownComponent,
    MonthlySummaryComponent,
    BudgetGauge,
    LoanFormComponent,
    LoanListComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  transactions: Transaction[] = [];
  showAddForm = false;
  showAddLoanForm = false;
  totalIncome = 0;
  totalExpenses = 0;
  balance = 0;

  constructor(private financeService: FinanceService) {}

  ngOnInit(): void {
    this.financeService.getTransactions().subscribe(transactions => {
      this.transactions = transactions;
      this.updateSummary();
    });
  }

  private updateSummary(): void {
    this.totalIncome = this.financeService.getTotalIncome();
    this.totalExpenses = this.financeService.getTotalExpenses();
    this.balance = this.financeService.getBalance();
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  toggleAddLoanForm(): void {
    this.showAddLoanForm = !this.showAddLoanForm;
  }

  onTransactionAdded(): void {
    this.showAddForm = false;
  }

  onLoanAdded(): void {
    this.showAddLoanForm = false;
  }

  onTransactionDeleted(id: string): void {
    this.financeService.deleteTransaction(id).subscribe({
      error: (err) => {
        console.error('Error deleting transaction:', err);
      }
    });
  }
}
