import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthorizedService } from '../routeGuards/authorized.service';
import { CreateGroupComponent } from './create-group/create-group.component';
import { ViewGroupComponent } from './view-group/view-group.component';
import { CreateExpenseComponent } from './create-expense/create-expense.component';
import { ViewExpenseComponent } from './view-expense/view-expense.component';
import { EditExpenseComponent } from './edit-expense/edit-expense.component';

const routes: Routes = [
  { path : 'dashboard' , component : DashboardComponent , canActivate : [AuthorizedService]},
  { path : 'createGroup' , component : CreateGroupComponent , canActivate : [AuthorizedService]},
  { path : 'viewGroup/:groupId' , component : ViewGroupComponent},
  { path : 'createExpense/:groupId' , component : CreateExpenseComponent},
  { path : 'viewExpense/:expenseId' , component : ViewExpenseComponent},
  { path : 'editExpense/:expenseId' , component : EditExpenseComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRouting {}
