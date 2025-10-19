import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { Course } from 'src/app/models/course.model';
import { Enrollment } from 'src/app/models/enrollment.model';
import { Student } from 'src/app/models/student.model';
import { CourseService } from 'src/app/services/course.service';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { StudentService } from 'src/app/services/students.service';

@Component({
  selector: 'app-enrollment-view',
  standalone: false,
  templateUrl: './enrollment-view.html',
  styleUrl: './enrollment-view.scss'
})
export class EnrollmentView implements OnInit {
  rows: Enrollment[] = [];
  loading = false;
  error?: string;

  studentsById = new Map<number, Student>();
  coursesById = new Map<number, Course>();

  selectedStudent?: Student;
  selectedCourse?: Course;

  constructor(
    private enrollmentSvc: EnrollmentService,
    private studentSvc: StudentService,
    private courseSvc: CourseService,
    private modal: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  private log = (...args: any[]) => console.log('[EnrollmentView]', ...args);
  private warn = (...args: any[]) => console.warn('[EnrollmentView]', ...args);
  private err  = (...args: any[]) => console.error('[EnrollmentView]', ...args);

  private n(v: unknown): number | undefined {
    // force number if possible (handles "12" vs 12)
    const x = Number(v as any);
    return Number.isFinite(x) ? x : undefined;
  }

  /** Resolve student id from either enrollment.studentId or enrollment.student?.id */
  private resolveStudentId(e: Enrollment): number | undefined {
    return this.n(e.studentId ?? e.student?.id);
  }

  /** Resolve course id from either enrollment.courseId or enrollment.course?.id */
  private resolveCourseId(e: Enrollment): number | undefined {
    return this.n(e.courseId ?? e.course?.id);
  }

  private loadAll(): void {
    this.loading = true;
    this.error = undefined;
    this.log('Loading students & courses…');

    forkJoin({
      students: this.studentSvc.getAll(),
      courses: this.courseSvc.getAll()
    }).subscribe({
      next: ({ students, courses }) => {
        this.log('Students loaded:', students?.length);
        this.log('Courses loaded:', courses?.length);

        // build maps with numeric keys
        this.studentsById = new Map(
          (students ?? [])
            .filter(s => s?.id != null)
            .map(s => [this.n(s.id)!, s])
        );
        this.coursesById = new Map(
          (courses ?? [])
            .filter(c => c?.id != null)
            .map(c => [this.n(c.id)!, c])
        );

        this.log('studentsById keys:', [...this.studentsById.keys()]);
        this.log('coursesById keys:', [...this.coursesById.keys()]);

        this.log('Loading enrollments…');
        this.enrollmentSvc.getAll().subscribe({
          next: (enrs) => {
            this.rows = enrs ?? [];
            this.loading = false;

            this.log('Enrollments loaded:', this.rows.length);
            // Quick snapshot of shapes
            try {
              console.table(this.rows.map(e => ({
                id: e.id,
                studentId: (e as any).studentId,
                studentObjId: (e as any).student?.id,
                courseId: (e as any).courseId,
                courseObjId: (e as any).course?.id,
                enrollDate: e.enrollDate
              })));
            } catch {}

            // Check if we can resolve every row
            this.rows.forEach((e, i) => {
              const sid = this.resolveStudentId(e);
              const cid = this.resolveCourseId(e);
              if (!sid) this.warn(`Row[${i}] cannot resolve studentId`, e);
              if (!cid) this.warn(`Row[${i}] cannot resolve courseId`, e);
              if (sid && !this.studentsById.has(sid)) this.warn(`Row[${i}] studentId=${sid} not found in studentsById keys`);
              if (cid && !this.coursesById.has(cid)) this.warn(`Row[${i}] courseId=${cid} not found in coursesById keys`);
            });
          },
          error: (e) => {
            this.err('Failed to load enrollments', e);
            this.error = 'Failed to load enrollments';
            this.loading = false;
          }
        });
      },
      error: (e) => {
        this.err('Failed to load students/courses', e);
        this.error = 'Failed to load students/courses';
        this.loading = false;
      }
    });
  }

  // ---------- UI helpers ----------
  avatarUrl(firstName?: string): string {
    const seed = encodeURIComponent(firstName || 'Student');
    return `https://api.dicebear.com/9.x/bottts/svg?seed=${seed}`;
  }

  studentName(e: Enrollment): string {
    const sid = this.resolveStudentId(e);
    const s = sid ? this.studentsById.get(sid) : undefined;
    return s ? `${s.firstName} ${s.lastName}` : (sid ? `#${sid}` : '—');
  }

  studentFirstName(e: Enrollment): string | undefined {
    const sid = this.resolveStudentId(e);
    return sid ? this.studentsById.get(sid)?.firstName : undefined;
  }

  courseName(e: Enrollment): string {
    const cid = this.resolveCourseId(e);
    const c = cid ? this.coursesById.get(cid) : undefined;
    return c ? c.courseName : (cid ? `#${cid}` : '—');
  }

  // ---------- Modals ----------
  openStudentDetails(e: Enrollment, tpl?: TemplateRef<any>) {
    const sid = this.resolveStudentId(e);
    this.log('openStudentDetails clicked. resolved studentId =', sid, 'row =', e);

    if (!sid || !tpl) {
      this.warn('No student id or template for modal', { sid, tplExists: !!tpl });
      return;
    }

    const cached = this.studentsById.get(sid);
    if (cached) {
      this.selectedStudent = cached;
      this.modal.open(tpl, { centered: true, size: 'lg' });
      return;
    }

    // Fallback fetch (should be rare if we preloaded)
    this.log('Student not in cache, fetching by id:', sid);
    this.studentSvc.getById(sid).subscribe({
      next: (s) => {
        this.selectedStudent = s;
        this.modal.open(tpl, { centered: true, size: 'lg' });
      },
      error: (e2) => this.err('Failed to fetch student by id', sid, e2)
    });
  }

  openCourseDetails(e: Enrollment, tpl?: TemplateRef<any>) {
    const cid = this.resolveCourseId(e);
    this.log('openCourseDetails clicked. resolved courseId =', cid, 'row =', e);

    if (!cid || !tpl) {
      this.warn('No course id or template for modal', { cid, tplExists: !!tpl });
      return;
    }

    const cached = this.coursesById.get(cid);
    if (cached) {
      this.selectedCourse = cached;
      this.modal.open(tpl, { centered: true, size: 'lg' });
      return;
    }

    this.log('Course not in cache, fetching by id:', cid);
    this.courseSvc.getById(cid).subscribe({
      next: (c) => {
        this.selectedCourse = c;
        this.modal.open(tpl, { centered: true, size: 'lg' });
      },
      error: (e2) => this.err('Failed to fetch course by id', cid, e2)
    });
  }

  // Optional: delete with logs
  remove(id?: number): void {
    this.log('Delete clicked for enrollment id', id);
    if (!id) return;
    if (!confirm('Delete this enrollment?')) return;
    this.loading = true;
    this.enrollmentSvc.delete(id).subscribe({
      next: () => {
        this.log('Enrollment deleted, reloading…');
        this.loadAll();
      },
      error: (e) => {
        this.err('Delete failed', e);
        this.loading = false;
        this.error = 'Delete failed';
      }
    });
  }
}