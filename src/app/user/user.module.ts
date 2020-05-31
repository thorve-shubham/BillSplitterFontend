import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRouting } from './user-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterialModule } from '../material/material.module';
import { CreateGroupComponent } from './create-group/create-group.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewGroupComponent } from './view-group/view-group.component';
import { CreateExpenseComponent } from './create-expense/create-expense.component';



@NgModule({
  declarations: [DashboardComponent, CreateGroupComponent, ViewGroupComponent, CreateExpenseComponent],
  imports: [
    CommonModule,
    UserRouting,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class UserModule { }
