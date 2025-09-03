import { Component } from '@angular/core';
import { StudentService } from '../services/students.service';
import { Router } from '@angular/router';
import { Student } from '../models/student.model';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {
saving = false;
  error?: string;

  constructor(private students: StudentService, private router: Router) {}

  // receives Student from the reused StudentForm
  handleSaved(student: Student) {
    this.saving = true; this.error = undefined;
    this.students.create(student).subscribe({
      next: (created) => {
        this.saving = false;
        localStorage.setItem('studentId', String(created.id));
        this.router.navigate(['/courses/front']); 
      },
      error: (e) => { this.saving = false; this.error = 'Signup failed'; console.error(e); }
    });
  }

  cancel() {
    this.router.navigate(['/auth/signin']);
  }
}
