import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoanService } from '../../services/loan.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './loan-form.component.html',
  styleUrls: ['./loan-form.component.css'],
})
export class LoanFormComponent implements OnInit {
  loanForm!: FormGroup;
  submitted = false;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.loanForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      borrowerName: ['', [Validators.required, Validators.minLength(2)]],
      borrowerPhone: ['', [Validators.required, Validators.minLength(10)]],
      dueDate: ['', Validators.required],
    });
  }

  get form() {
    return this.loanForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.loanForm.invalid) {
      return;
    }

    this.loading = true;
    const loanData = {
      ...this.loanForm.value,
      dueDate: new Date(this.loanForm.value.dueDate).toISOString(),
    };

    this.loanService.createLoan(loanData).subscribe({
      next: (response) => {
        this.successMessage = '✅ Loan created successfully!';
        this.loanForm.reset();
        this.submitted = false;
        this.loading = false;
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = '❌ Failed to create loan. Please try again.';
        this.loading = false;
        console.error('Error:', error);
      },
    });
  }

  resetForm() {
    this.loanForm.reset();
    this.submitted = false;
    this.successMessage = '';
    this.errorMessage = '';
  }
}
