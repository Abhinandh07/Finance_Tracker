import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, DashboardComponent],
  template: `
    <app-dashboard></app-dashboard>
  `,
  styleUrl: './app.css'
})
export class App {
  title = 'Finance Tracker';
}
