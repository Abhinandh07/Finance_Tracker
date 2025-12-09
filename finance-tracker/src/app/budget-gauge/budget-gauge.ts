import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../services/finance.service';
import { Transaction } from '../models/transaction.model';

@Component({
  selector: 'app-budget-gauge',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './budget-gauge.html',
  styleUrl: './budget-gauge.css',
})
export class BudgetGauge implements OnInit {
  budget: number = 2000;
  totalSpent: number = 0;
  percentUsed: number = 0;
  transactions: Transaction[] = [];
  private currentMonth: number = new Date().getMonth();
  private currentYear: number = new Date().getFullYear();

  constructor(private financeService: FinanceService) {
    console.log('✅ BudgetGauge component created');
  }

  ngOnInit(): void {
    console.log('✅ BudgetGauge ngOnInit started');
    this.loadData();

    this.financeService.transactions$.subscribe(() => {
      console.log('✅ Transactions updated, checking if month changed');
      const today = new Date();
      const newMonth = today.getMonth();
      const newYear = today.getFullYear();

      // Only reload if the month/year changed
      if (newMonth !== this.currentMonth || newYear !== this.currentYear) {
        console.log('✅ Month changed! Resetting budget');
        this.currentMonth = newMonth;
        this.currentYear = newYear;
        this.resetBudget();
      } else {
        // Still in the same month, just recalculate spent amount
        this.recalculateSpent();
      }
    });
  }

  loadData(): void {
    console.log('✅ Loading budget and transaction data');

    this.financeService.getBudget().subscribe({
      next: (res: any) => {
        console.log('✅ Budget received:', res);
        this.budget = res.amount;
        this.calculateSpent();
      },
      error: (err: any) => {
        console.error('❌ Error loading budget:', err);
        this.budget = 2000;
        this.calculateSpent();
      }
    });

    this.financeService.getTransactions().subscribe({
      next: (transactions) => {
        console.log('✅ Transactions received:', transactions);
        this.transactions = transactions;
        this.recalculateSpent();
      },
      error: (err: any) => {
        console.error('❌ Error loading transactions:', err);
        this.transactions = [];
        this.totalSpent = 0;
        this.calculateSpent();
      }
    });
  }

  private recalculateSpent(): void {
    // Only count expenses from the current month
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    this.totalSpent = this.transactions
      .filter(t => {
        if (t.type !== 'expense') return false;
        const transDate = new Date(t.date);
        return (
          transDate.getMonth() === currentMonth &&
          transDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);

    console.log('✅ Total spent (current month only):', this.totalSpent);
    this.calculateSpent();
  }

  private resetBudget(): void {
    // Reset budget at the start of a new month
    console.log('✅ Resetting budget for new month');
    this.budget = 2000; // Or whatever your default is
    this.recalculateSpent();
  }

  calculateSpent(): void {
    if (this.budget > 0) {
      this.percentUsed = (this.totalSpent / this.budget) * 100;
    } else {
      this.percentUsed = 0;
    }
    console.log('✅ Percent used:', this.percentUsed);
  }

  updateBudget(): void {
    console.log('✅ Updating budget to:', this.budget);
    this.financeService.setBudget(this.budget).subscribe({
      next: () => {
        console.log('✅ Budget updated successfully');
        this.calculateSpent();
      },
      error: (err: any) => {
        console.error('❌ Error updating budget:', err);
      }
    });
  }
}
