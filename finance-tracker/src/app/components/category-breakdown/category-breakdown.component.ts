import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-category-breakdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-breakdown.component.html',
  styleUrl: './category-breakdown.component.css'
})
export class CategoryBreakdownComponent {
  @Input() transactions: Transaction[] = [];

  getCategoryTotal(category: string): number {
    return this.transactions
      .filter(t => t.category === category && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getExpenseCategories(): string[] {
    return ['Food', 'Transport', 'Entertainment', 'Utilities', 'Other'];
  }

  getTotalExpenses(): number {
    return this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getPercentage(category: string): number {
    const total = this.getTotalExpenses();
    if (total === 0) return 0;
    return Math.round((this.getCategoryTotal(category) / total) * 100);
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'Food': 'bg-orange-500',
      'Transport': 'bg-blue-500',
      'Entertainment': 'bg-purple-500',
      'Utilities': 'bg-yellow-500',
      'Other': 'bg-gray-500'
    };
    return colors[category] || colors['Other'];
  }
}
