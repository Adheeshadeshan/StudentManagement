import { Component, ViewChild } from '@angular/core';
import { StudentTableComponent } from '../student-table/student-table.component';
import { ButtonModule, ModalModule } from '@coreui/angular';
import { StudentFormComponent } from '../student-form/student-form.component';
import { Student } from '../models/student';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [
    StudentTableComponent,
    ModalModule,
    ButtonModule,
    StudentFormComponent,
    CommonModule,
  ],
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.scss',
})
export class StudentDetailComponent {
  @ViewChild(StudentTableComponent) studentTableComponent!: StudentTableComponent;
  
  visible = false;
  selectedStudent!: Student | undefined;
  viewMode!: 'EDIT' | 'ADD' | 'VIEW';

  get studentId(): number {
    return this.selectedStudent ? this.selectedStudent.id : 0;
  }

  /** Closes the modal and optionally reloads the student list */
  closeModal(isReload: boolean) {
    this.visible = false;
    if (isReload) {
      this.viewMode = 'ADD';
      this.studentTableComponent.loadStudents();
    }
  }

  /** Sets the selected student and opens the modal in the specified mode */
  onStudentSelect(student: Student, mode: 'EDIT' | 'VIEW'): void {
    this.viewMode = mode;
    this.selectedStudent = student;
    this.visible = true;
  }

  /** Opens the modal to add a new student */
  addNewStudent(): void {
    this.visible = true;
    this.viewMode = 'ADD';
    this.selectedStudent = undefined;
  }
}
