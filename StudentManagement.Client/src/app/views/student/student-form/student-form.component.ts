import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { StudentService } from '../services/student.service';
import { Student } from '../models/student';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@coreui/angular';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ButtonModule],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.scss',
})
export class StudentFormComponent implements OnInit {
  @Input() studentId!: number;
  @Output() onCloseModal = new EventEmitter<boolean>();
  private subscriptions: Subscription = new Subscription();
  studentForm: FormGroup;
  @Input() viewMode!: 'EDIT' | 'ADD' | 'VIEW';

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService
  ) {
    // Initialize form
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      nic: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      address: ['', Validators.required],
      profileImageUrl: [''],
    });
  }

  ngOnInit(): void {
    if (this.studentId) {
      this.loadStudentData(this.studentId);
    }
  }

  // Load student data for editing
  loadStudentData(id: number): void {
    this.studentService.getStudentById(id).subscribe((student) => {
      console.log('student >>>>>>>>>>>>>>', student);
      const formattedDateOfBirth = new Date(student.dateOfBirth).toISOString().split('T')[0];
      this.studentForm.patchValue(student);
      this.studentForm.get('dateOfBirth')?.setValue(formattedDateOfBirth);

      if(this.viewMode == 'VIEW') {
        this.studentForm.disable();
      } else {
        this.studentForm.enable();
      }
    });
  }

  // Submit form to add or update a student
  onSubmit(): void {
    debugger;
    if (this.studentForm.valid) {
      const studentData: Student = this.studentForm.value;

      if (this.viewMode == 'EDIT' && this.studentId !== null) {
        // Update existing student
        studentData.id = this.studentId
        this.studentService
          .updateStudent(this.studentId, studentData)
          .subscribe((response) => {
            this.onCloseModal.emit(true);
            console.log('Student updated successfully:', response);
          });
      } else {
        // Add new student
        this.studentService.addStudent(studentData).subscribe((response) => {
          this.onCloseModal.emit(true);
          console.log('Student added successfully:', response);
        });
      }
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.subscriptions.unsubscribe();
  }
}
