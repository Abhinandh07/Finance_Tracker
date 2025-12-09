import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinanceService } from '../../services/finance.service';
import { Category, TransactionType } from '../../models/transaction.model';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.css'
})
export class TransactionFormComponent {
  @Output() transactionAdded = new EventEmitter<void>();

  form: FormGroup;
  categories: Category[] = ['Income', 'Food', 'Transport', 'Entertainment', 'Utilities', 'Other'];
  types: TransactionType[] = ['income', 'expense'];
  isSubmitting = false;

  constructor(private fb: FormBuilder, private financeService: FinanceService) {
    this.form = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(3)]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      category: ['Food', Validators.required],
      type: ['expense', Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formValue = this.form.value;
      this.financeService.addTransaction({
        date: new Date(formValue.date),
        description: formValue.description,
        amount: parseFloat(formValue.amount),
        category: formValue.category,
        type: formValue.type
      }).subscribe({
        next: () => {
          this.form.reset({
            category: 'Food',
            type: 'expense',
            date: new Date().toISOString().split('T')[0]
          });
          this.isSubmitting = false;
          this.transactionAdded.emit();
        },
        error: (err) => {
          console.error('Error adding transaction:', err);
          this.isSubmitting = false;
        }
      });
    }
  }

  get description() {
    return this.form.get('description');
  }

  get amount() {
    return this.form.get('amount');
  }
}
