import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentTableComponent } from './student-table/student-table.component';

@NgModule({
  declarations: [
    StudentTableComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StudentTableComponent
  ]
})
export class StudentModule { }
