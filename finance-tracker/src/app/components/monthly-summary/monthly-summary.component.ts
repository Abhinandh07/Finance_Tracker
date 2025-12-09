import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-monthly-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monthly-summary.component.html',
  styleUrl: './monthly-summary.component.css'
})
export class MonthlySummaryComponent {
  @Input() totalIncome = 0;
  @Input() totalExpenses = 0;
  @Input() balance = 0;

  getSavingRate(): number {
    if (this.totalIncome === 0) return 0;
    return Math.round(((this.balance / this.totalIncome) * 100) * 10) / 10;
  }
}
