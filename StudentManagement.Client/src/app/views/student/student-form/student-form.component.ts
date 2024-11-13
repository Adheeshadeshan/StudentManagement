import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { StudentService } from '../services/student.service';
import { Student } from '../models/student';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@coreui/angular';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ButtonModule],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.scss',
})
export class StudentFormComponent implements OnInit {
  @Input() studentId!: number;
  @Input() viewMode!: 'EDIT' | 'ADD' | 'VIEW';
  @Output() onCloseModal = new EventEmitter<boolean>();
  private subscriptions: Subscription = new Subscription();

  studentForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    if (this.studentId) {
      this.loadStudentData(this.studentId);
    }
  }

  initializeForm() {
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      nic: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      address: ['', Validators.required],
      profileImageUrl: ['assets/images/avatars/student1.png'],
    });
  }

  /** Load student data for editing */
  private loadStudentData(id: number): void {
    this.studentService.getStudentById(id).subscribe((student) => {
      const formattedDateOfBirth = new Date(student.dateOfBirth)
        .toISOString()
        .split('T')[0];
      this.studentForm.patchValue(student);
      this.studentForm.get('dateOfBirth')?.setValue(formattedDateOfBirth);

      if (this.viewMode == 'VIEW') {
        this.studentForm.disable();
      } else {
        this.studentForm.enable();
      }
    });
  }

  /** Submit form to add or update a student */
  onSubmit(): void {
    if (this.studentForm.valid) {
      const studentData: Student = this.studentForm.value;

      if (this.viewMode == 'EDIT' && this.studentId !== null) {
        // Update existing student
        studentData.id = this.studentId;
        this.studentService
          .updateStudent(this.studentId, studentData)
          .subscribe(() => {
              this.onCloseModal.emit(true);
              this.toastrService.success('Student updated successfully');
          });
      } else {
        // Add new student
        this.studentService.addStudent(studentData).subscribe(() => {
            this.onCloseModal.emit(true);
            this.toastrService.success('Student added successfully');
        });
      }
    }
  }

  /** Unsubscribe from all subscriptions to prevent memory leaks */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
