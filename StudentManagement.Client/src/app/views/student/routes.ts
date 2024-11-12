import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Student'
    },
    children: [
      {
        path: '',
        redirectTo: 'student',
        pathMatch: 'full'
      },
      {
        path: 'student',
        loadComponent: () => import('./student-detail/student-detail.component').then(m => m.StudentDetailComponent),
        data: {
          title: 'Student'
        }
      }
    ]
  }
];

