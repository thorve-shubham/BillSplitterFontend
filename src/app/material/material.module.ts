import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';

const MaterialComponents = [
  MatFormFieldModule,
  MatInputModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatCardModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatOptionModule,
  MatSelectModule,
  MatSnackBarModule,
  MatChipsModule,
  MatIconModule,
  MatRadioModule,
  MatCheckboxModule
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialComponents
  ],
  exports: [MaterialComponents]
})
export class MaterialModule { }
