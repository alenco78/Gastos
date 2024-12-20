import { Routes } from '@angular/router';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { WeeklyExpensesComponent } from './weekly-expenses/weekly-expenses.component';
import { TotalExpensesComponent } from './total-expenses/total-expenses.component';

export const routes: Routes = [
  { path: '', redirectTo: 'expenses', pathMatch: 'full' },
  { path: 'expenses', component: AddExpenseComponent },
  { path: 'weekly', component: WeeklyExpensesComponent },
  { path: 'total', component: TotalExpensesComponent }
];
