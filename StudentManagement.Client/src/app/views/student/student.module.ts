import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentTableComponent } from './student-table/student-table.component';
import { StudentFormComponent } from './student-form/student-form.component';
import { StudentDetailComponent } from './student-detail/student-detail.component';
@NgModule({
  declarations: [
    StudentTableComponent,
    StudentFormComponent,
    StudentDetailComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StudentTableComponent
  ]
})
export class StudentModule { }
