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
  @ViewChild(StudentTableComponent)
  studentTableComponent!: StudentTableComponent;
  selectedStudent!: Student;
  visible = false;
  viewMode!: 'EDIT' | 'ADD' | 'VIEW';

  get studentId(): number {
    return this.selectedStudent ? this.selectedStudent.id : 0;
  }

  closeModal(isReload: boolean) {
    this.visible = false;
    if (isReload) {
      this.viewMode = 'ADD';
      this.studentTableComponent.loadStudents();
    }
  }

  onStudentSelect(student: Student, mode: 'EDIT' | 'VIEW') {
    this.viewMode = mode;
    this.selectedStudent = student;
    this.visible = true;
  }

  onAddStudentButtonClick() {
    this.visible = true;
    this.viewMode = 'ADD';
  }

  onClose() {
    this.visible = false;
  }
}
