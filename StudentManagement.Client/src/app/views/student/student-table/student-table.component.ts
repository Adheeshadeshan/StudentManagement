import {
  Component,
  OnInit,
  OnDestroy,
  output,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Student } from '../models/student';
import { ButtonModule, PaginationModule, TableModule } from '@coreui/angular';
import { debounceTime, Subject, Subscription, switchMap, tap } from 'rxjs';
import { StudentService } from '../services/student.service';
import { IconModule } from '@coreui/icons-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    IconModule,
    PaginationModule,
    FormsModule,
  ],
})
export class StudentTableComponent implements OnInit, OnDestroy {
  @Output() onStudentSelect = new EventEmitter<Student>();
  @Output() onViewStudent = new EventEmitter<Student>();

  students: Student[] = [];
  displayedStudents: Student[] = [];
  private subscription: Subscription | undefined;
  private searchSubject: Subject<string> = new Subject<string>();
  searchTerm: string = '';
  currentPage = 1;
  pageSize = 10;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadStudents();

    this.searchSubject
      .pipe(
        debounceTime(300),
        switchMap((searchTerm) => {
          this.searchTerm = searchTerm;
          return this.searchStudents(searchTerm);
        }),
        tap(() => this.updateDisplayedStudents())
      )
      .subscribe();
  }

  loadStudents(): void {
    this.subscription = this.studentService.getStudents().subscribe({
      next: (data: Student[]) => {
        this.students = data;
        this.updateDisplayedStudents();
      },
      error: (error) => {
        console.error('Error loading students:', error);
      },
    });
  }

  searchStudents(searchTerm: string): Student[] {
    if (!searchTerm) {
      return this.students; // If no search term, return all students
    }

    // Filter all fields by the search term (case-insensitive)
    return this.students.filter((student) =>
      Object.values(student).some(
        (value) =>
          typeof value === 'string' &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }

  get totalPages(): number {
    return Math.ceil(this.students.length / this.pageSize);
  }

  updateDisplayedStudents(): void {
    const filteredStudents = this.searchStudents(this.searchTerm);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = this.currentPage * this.pageSize;
    this.displayedStudents = filteredStudents.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updateDisplayedStudents();
  }

  onEdit(student: Student): void {
    console.log('student,', student);
    this.onStudentSelect.emit(student);
  }

  onView(student: Student): void {
    this.onViewStudent.emit(student);
  }

  deleteStudent(studentId: number): void {
    const confirmDelete = confirm(
      'Are you sure you want to delete this student?'
    );
    if (confirmDelete) {
      this.studentService.deleteStudent(studentId).subscribe({
        next: () => {
          console.log('Student deleted successfully');
          this.loadStudents(); // Refresh the student list after deletion
        },
        error: (error) => {
          console.error('Error deleting student:', error);
        },
      });
    }
  }

  onSearchChange(searchTerm: string): void {
    // this.searchTerm = searchTerm;
    this.searchSubject.next(searchTerm); // Trigger the search
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
