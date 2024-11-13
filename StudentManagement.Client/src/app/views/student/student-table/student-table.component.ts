import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Student } from '../models/student';
import { ButtonModule, PaginationModule, TableModule } from '@coreui/angular';
import {
  BehaviorSubject,
  debounceTime,
  Subject,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { StudentService } from '../services/student.service';
import { IconModule } from '@coreui/icons-angular';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrl: './student-table.component.scss',
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

  pageSize = 10;
  currentPage = 1;
  searchTerm: string = '';
  students: Student[] = [];
  displayedStudents: Student[] = [];
  private subscription: Subscription | undefined;
  private searchSubject: Subject<string> = new Subject<string>();
  /** Observable to handle sorting state, initially set to sort by 'firstName' in ascending order */ 
  private sortSubject: BehaviorSubject<{
    column: keyof Student;
    direction: 'asc' | 'desc';
  }> = new BehaviorSubject<{
    column: keyof Student;
    direction: 'asc' | 'desc';
  }>({ column: 'firstName', direction: 'asc' });

  /** Object representing the current sort state, with initial values set to sort by 'firstName' in ascending order */
  sortState: { column: keyof Student; direction: 'asc' | 'desc' } = {
    column: 'firstName',
    direction: 'asc',
  };

  constructor(
    private studentService: StudentService,
    private toastrService: ToastrService
  ) {}

  /** Calculate the total number of pages based on the filtered student list and page size */
  get totalPages(): number {
    const filteredStudents = this.searchStudents(this.searchTerm);
    return Math.ceil(filteredStudents.length / this.pageSize);
  }

  ngOnInit(): void {
    this.loadStudents();

    /** Merge search and sort into a single stream */ 
    this.subscription = this.searchSubject
      .pipe(
        debounceTime(300),
        tap((searchTerm) => (this.searchTerm = searchTerm)),
        switchMap(() => this.sortSubject),
        tap(() => this.updateDisplayedStudents())
      )
      .subscribe();
  }

  /** Load students from the service and update display */
  loadStudents(): void {
    this.subscription = this.studentService.getStudents().subscribe({
      next: (data: Student[]) => {
        this.students = data;
        this.updateDisplayedStudents();
      },
      error: (error) => {
        this.toastrService.error('Error loading students:', error);
      },
    });
  }

  /** Handle sort change for a specified column */
  onSortChange(column: keyof Student): void {
    const newDirection =
      this.sortState.column === column
        ? this.sortState.direction === 'asc'
          ? 'desc'
          : 'asc'
        : 'asc';
    this.sortState = { column, direction: newDirection };
    this.sortSubject.next(this.sortState);
    this.updateDisplayedStudents();
  }

  /** Update the current page and refresh displayed students */
  changePage(page: number): void {
    this.currentPage = page;
    this.updateDisplayedStudents();
  }

  /** Emit student selection event for editing */
  onEdit(student: Student): void {
    this.onStudentSelect.emit(student);
  }

  /** Emit student selection event for viewing */
  onView(student: Student): void {
    this.onViewStudent.emit(student);
  }

  /** Delete a student after confirmation */
  onDeleteStudent(studentId: number): void {
    const confirmDelete = confirm(
      'Are you sure you want to delete this student?'
    );
    if (confirmDelete) {
      this.studentService.deleteStudent(studentId).subscribe({
        next: () => {
          this.toastrService.success('Student deleted successfully');
          this.loadStudents();
        },
        error: (error) => {
          this.toastrService.error('Error deleting student:', error);
        },
      });
    }
  }

  /** Handle search term change and refresh displayed students */
  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.currentPage = 1;
    this.searchSubject.next(searchTerm);
  }

  /** Filter students based on the search term */
  private searchStudents(searchTerm: string): Student[] {
    if (!searchTerm) {
      return this.students;
    }

    // Filter all fields by the search term
    return this.students.filter((student) =>
      Object.values(student).some(
        (value) =>
          typeof value === 'string' &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }

  /** Update the list of students displayed on the current page */
  private updateDisplayedStudents(): void {
    let filteredStudents = this.searchStudents(this.searchTerm);
    filteredStudents = this.sortStudents(
      filteredStudents,
      this.sortState.column,
      this.sortState.direction
    );
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = this.currentPage * this.pageSize;
    this.displayedStudents = filteredStudents.slice(startIndex, endIndex);
  }

   /** Sort students based on the selected column and direction */
  private sortStudents(
    students: Student[],
    column: keyof Student,
    direction: 'asc' | 'desc'
  ): Student[] {
    return students.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      // Handle undefined values, treating undefined as "less than" defined values
      if (valueA === undefined) return direction === 'asc' ? -1 : 1;
      if (valueB === undefined) return direction === 'asc' ? 1 : -1;

      // Compare values based on the sort direction
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      return 0;
    });
  }

  /** Clean up subscriptions to prevent memory leaks */
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
