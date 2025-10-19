// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { StudentService } from './students.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly ADMIN_EMAILS = ['admin@eduvermeg.tn', 'admin@example.com'];

  constructor(private router: Router, private students: StudentService) {}

  // Save role + student id (if student)
  private setAdmin(): void {
    localStorage.setItem('role', 'admin');
    localStorage.removeItem('studentId');
  }
  private setStudent(id: number): void {
    localStorage.setItem('role', 'student');
    localStorage.setItem('studentId', String(id));
  }

  isAdmin(): boolean { return localStorage.getItem('role') === 'admin'; }
  isStudent(): boolean { return localStorage.getItem('role') === 'student' && !!localStorage.getItem('studentId'); }
  isAuthenticated(): boolean { return this.isAdmin() || this.isStudent(); }
  currentStudentId(): number | null {
    const id = localStorage.getItem('studentId');
    return id ? Number(id) : null;
  }

  signOut(): void {
    localStorage.removeItem('role');
    localStorage.removeItem('studentId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    this.router.navigate(['/auth/signin']);
  }
  avatarUrl(seed?: string): string {
    const safe = encodeURIComponent(seed || 'User');

    return `https://api.dicebear.com/9.x/bottts/svg?seed=${safe}`;
  }
   get currentUser() {
    const name  = localStorage.getItem('userName') || '';
    const email = localStorage.getItem('userEmail') || '';
    const role  = localStorage.getItem('role') || '';
    const seed  = name || email || 'User';
    return {
      name,
      email,
      role,
      avatar: this.avatarUrl(seed)  
    };
  }

  // Sign in by email: sets role + studentId then routes
  signInByEmail(email: string) {
    const lower = email.toLowerCase();
    if (this.ADMIN_EMAILS.includes(lower)) {
      this.setAdmin();
      localStorage.setItem('userName', 'Admin User');  
      localStorage.setItem('userEmail', email);
      this.router.navigate(['/students/view']);
      return of(true);
    }
    // not admin → check student exists
    return this.students.getAll().pipe(
      map(list => {
        const found = list.find(s => s.email?.toLowerCase() === lower);
        if (found?.id != null) {
          this.setStudent(found.id);
          localStorage.setItem('userName', `${found.firstName ?? ''} ${found.lastName ?? ''}`.trim());
          localStorage.setItem('userEmail', found.email || email);
          this.router.navigate(['/courses/front']);
          return true;
        }
        return false;
      }),
      catchError(() => of(false))
    );
  }
}
