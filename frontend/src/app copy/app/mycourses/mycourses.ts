import { Component, OnInit, TemplateRef } from '@angular/core';
import { Course } from '../models/course.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { Enrollment } from '../models/enrollment.model';
import { AuthService } from '../services/auth.service';
import { CourseService } from '../services/course.service';
import { EnrollmentService } from '../services/enrollment.service';
import { UnsplashPhoto, UnsplashService } from '../services/unsplash.service';
type CourseCard = {
  course: Course;
  enrollDate?: string;
  completionStatus?: string;
  grade?: number;
};

@Component({
  selector: 'app-mycourses',
  standalone: false,
  templateUrl: './mycourses.html',
  styleUrl: './mycourses.scss'
})
export class Mycourses implements OnInit {
  loading = false;
  error?: string;

  /** Final grid rows (deduplicated courses for the student) */
  rows: CourseCard[] = [];

  /** Image cache per courseName (like your CourseView) */
  private imgCache = new Map<string, { url: string; photo?: UnsplashPhoto }>();

  selectedCourse?: Course; // for modal

  constructor(
    private enrollments: EnrollmentService,
    private courses: CourseService,
    private auth: AuthService,
    private modal: NgbModal,
    private unsplash: UnsplashService,
  ) {}

  private log = (...a: any[]) => console.log('[StudentCourses]', ...a);
  private warn = (...a: any[]) => console.warn('[StudentCourses]', ...a);
  private err  = (...a: any[]) => console.error('[StudentCourses]', ...a);

  ngOnInit(): void {
    this.load();
  }

  private n(v: unknown): number | undefined {
    const x = Number(v as any);
    return Number.isFinite(x) ? x : undefined;
  }

  private resolveCourseId(e: Enrollment): number | undefined {
    return this.n(e.courseId ?? e.course?.id);
  }

  load(): void {
    const sid = this.auth.currentStudentId();
    if (!sid) {
      this.error = 'No logged-in student found.';
      this.warn('currentStudentId() is null → did you sign in as student?');
      return;
    }

    this.loading = true;
    this.error = undefined;
    this.log('Loading courses for studentId =', sid);

    // Load all courses once; load all enrollments then filter by student
    forkJoin({
      allCourses: this.courses.getAll(),
      allEnrollments: this.enrollments.getAll()
    }).subscribe({
      next: ({ allCourses, allEnrollments }) => {
        this.log('Courses count:', allCourses.length);
        this.log('Enrollments count:', allEnrollments.length);

        // Build a map id -> course for quick lookup
        const courseMap = new Map<number, Course>(
          allCourses.filter(c => c.id != null).map(c => [Number(c.id), c])
        );

        // Filter enrollments for this student
        const mine = (allEnrollments || []).filter(e => {
          const studentId = this.n(e.studentId ?? e.student?.id);
          return studentId === sid;
        });
        this.log('Enrollments for current student:', mine.length);
        try {
          console.table(mine.map(e => ({
            enrId: e.id,
            courseId: (e as any).courseId,
            courseObjId: (e as any).course?.id,
            enrollDate: e.enrollDate,
            status: e.completionStatus,
            grade: e.grade
          })));
        } catch {}

        // Deduplicate by course (keep first enrollment metadata per course)
        const seen = new Set<number>();
        const cards: CourseCard[] = [];
        for (const e of mine) {
          const cid = this.resolveCourseId(e);
          if (!cid) {
            this.warn('Enrollment has no resolvable course id:', e);
            continue;
          }
          if (seen.has(cid)) continue;
          seen.add(cid);

          // prefer embedded course object if present, else map lookup
          const embedded = e.course;
          const resolved = embedded?.id ? embedded :
                           (courseMap.get(cid) ?? undefined);

          if (!resolved) {
            this.warn('Could not resolve course data for courseId=', cid, 'from enrollment=', e);
            continue;
          }

          cards.push({
            course: resolved,
            enrollDate: e.enrollDate,
            completionStatus: e.completionStatus,
            grade: e.grade
          });

          // warm up image cache async (non-blocking)
          this.ensureImageFor(resolved.courseName);
        }

        this.rows = cards;
        this.loading = false;
        this.log('Final course cards count:', this.rows.length);
      },
      error: (e) => {
        this.err('Failed to load data', e);
        this.error = 'Failed to load data';
        this.loading = false;
      }
    });
  }

  // ---------- Images (Unsplash, like your CourseView) ----------
  private ensureImageFor(courseName: string): void {
    if (this.imgCache.has(courseName)) return;

    const keyword = `${courseName}`;
    this.unsplash.imageUrlFor(keyword, 'regular').subscribe(url => {
      if (url) this.imgCache.set(courseName, { url });
      else this.imgCache.set(courseName, { url: '' });
    });

    this.unsplash.firstPhoto(keyword).subscribe(photo => {
      if (photo) {
        const u = new URL(photo.urls.small);
        u.searchParams.set('utm_source', 'your_app_name');
        u.searchParams.set('utm_medium', 'referral');
        this.imgCache.set(courseName, { url: u.toString(), photo });
      }
    });
  }

  courseImage(courseName: string): string | null {
    const entry = this.imgCache.get(courseName);
    return entry?.url || null;
  }

  useImage(courseName: string): void {
    const entry = this.imgCache.get(courseName);
    if (entry?.photo) {
      this.unsplash.trackDownload(entry.photo.links.download_location).subscribe();
    }
  }

  // ---------- UI actions ----------
  openCourseDetails(card: CourseCard, tpl: TemplateRef<any>) {
    this.selectedCourse = card.course;
    this.modal.open(tpl, { centered: true, size: 'lg' });
  }

  // If you prefer navigation:
  // goToCourse(card: CourseCard) {
  //   this.router.navigate(['/courses', card.course.id]);
  // }
}
