import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  styleUrl: './course-detail.scss'
})
export class CourseDetail implements OnInit {
  loading = false;
  error?: string;

  course?: Course;
  heroUrl?: string;

  // enroll UI
  students: Student[] = [];
  selectedStudentId?: number;
  enrolling = false;
  enrollMsg?: string;

  constructor(
    private route: ActivatedRoute,
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
    return `${name} course education learning classroom`;
  }

  load(id: number): void {
    this.loading = true;
    this.error = undefined;
    this.courses.getById(id).subscribe({
      next: (c) => {
        this.course = c;
        this.loading = false;

        // load hero image
        this.unsplash.imageUrlFor(this.buildKeyword(c.courseName), 'regular').subscribe(url => this.heroUrl = url || undefined);

        // load students for dropdown
        this.studentsSvc.getAll().subscribe(s => this.students = s);
      },
      error: (e) => { this.loading = false; this.error = 'Failed to load course'; console.error(e); }
    });
  }

  enroll(): void {
    if (!this.course?.id) { this.enrollMsg = 'Course not found.'; return; }
    this.enrolling = true; this.enrollMsg = undefined;
    const studentId = localStorage.getItem('studentId');

    const payload = {
      studentId: Number(studentId), 
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
