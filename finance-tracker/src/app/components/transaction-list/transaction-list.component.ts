import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css'
})
export class TransactionListComponent {
  @Input() transactions: Transaction[] = [];
  @Output() transactionDeleted = new EventEmitter<string>();

  deleteTransaction(id: string): void {
    this.transactionDeleted.emit(id);
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'Income': 'bg-green-100 text-green-800',
      'Food': 'bg-orange-100 text-orange-800',
      'Transport': 'bg-blue-100 text-blue-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Utilities': 'bg-yellow-100 text-yellow-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['Other'];
  }
}
