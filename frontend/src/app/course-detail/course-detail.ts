import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from '../models/course.model';
import { Student } from '../models/student.model';
import { CourseService } from '../services/course.service';
import { EnrollmentService } from '../services/enrollment.service';
import { StudentService } from '../services/students.service';
import { UnsplashService } from '../services/unsplash.service';

@Component({
  selector: 'app-course-detail',
  standalone: false,
  templateUrl: './course-detail.html',
  styleUrls: ['./course-detail.scss'] // << fix plural
})
export class CourseDetail implements OnInit {
  loading = false;
  error?: string;

  course?: Course;
  heroUrl?: string;

  // enroll UI (kept minimal)
  students: Student[] = [];
  enrolling = false;
  enrollMsg?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courses: CourseService,
    private studentsSvc: StudentService,
    private enrollments: EnrollmentService,
    private unsplash: UnsplashService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.error = 'Invalid course id'; return; }
    this.load(id);
  }

  private buildKeyword(name: string): string {
    return `${name} education course learning classroom`;
  }

  load(id: number): void {
    this.loading = true;
    this.error = undefined;
    this.courses.getById(id).subscribe({
      next: (c) => {
        this.course = c;
        this.loading = false;

        // hero image (non-blocking)
        this.unsplash.imageUrlFor(this.buildKeyword(c.courseName), 'regular')
          .subscribe(url => this.heroUrl = url || undefined);

        // optional: preload students for later UI (non-blocking)
        this.studentsSvc.getAll().subscribe(s => this.students = s || []);
      },
      error: (e) => { this.loading = false; this.error = 'Failed to load course'; console.error(e); }
    });
  }

  back(): void {
    history.length > 1 ? history.back() : this.router.navigate(['/courses/front']);
  }

  daysUntil(): number | null {
    if (!this.course?.startDate) return null;
    const today = new Date();
    const start = new Date(this.course.startDate);
    return Math.ceil((start.getTime() - today.getTime()) / (1000*60*60*24));
  }
  started(): boolean {
    const d = this.daysUntil();
    return d !== null && d <= 0;
  }

  enroll(): void {
    if (!this.course?.id) { this.enrollMsg = 'Course not found.'; return; }
    this.enrolling = true; this.enrollMsg = undefined;

    const studentId = Number(localStorage.getItem('studentId'));
    if (!studentId) { this.enrolling = false; this.enrollMsg = 'Please sign in as a student first.'; return; }

    const payload = {
      studentId,
      courseId: this.course.id,
      enrollDate: new Date().toISOString().substring(0, 10),
      completionStatus: 'ENROLLED',
      grade: null
    };

    this.enrollments.create(payload as any).subscribe({
      next: () => { this.enrolling = false; this.enrollMsg = 'Enrollment successful!'; },
      error: (e) => { this.enrolling = false; this.enrollMsg = 'Enrollment failed.'; console.error(e); }
    });
  }
}
