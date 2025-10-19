import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../models/course.model';
import { CourseService } from '../services/course.service';
import { UnsplashPhoto, UnsplashService } from '../services/unsplash.service';

type SortKey = 'recent' | 'name' | 'duration';

@Component({
  selector: 'app-course-grid',
  standalone: false,
  templateUrl: './course-grid.html',
  styleUrls: ['./course-grid.scss']
})
export class CourseGrid implements OnInit {
  loading = false;
  error?: string;

  // raw data
  rows: Course[] = [];

  // UI state
  q = '';
  sort: SortKey = 'recent';

  // filter modal
  showFilter = false;
  f = {
    q: '' as string,
    minDuration: undefined as number | undefined,
    maxDuration: undefined as number | undefined,
    startFrom: '' as string | '',
    startTo: '' as string | '',
    endFrom: '' as string | '',
    endTo: '' as string | ''
  };

  // validation
  durationError?: string;

  // image cache
  private imgCache = new Map<string, { url: string; photo?: UnsplashPhoto }>();

  constructor(
    private courses: CourseService,
    private unsplash: UnsplashService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = undefined;

    this.courses.getAll().subscribe({
      next: (data) => {
        this.rows = data || [];
        this.loading = false;
        for (const c of this.rows) this.ensureImageFor(c.courseName);
      },
      error: (e) => {
        this.loading = false;
        this.error = 'Failed to load courses';
        console.error(e);
      }
    });
  }

  // ---------- Images ----------
  private keyword(name: string): string {
    return `${name} education training course`;
  }

  private ensureImageFor(courseName: string): void {
    if (this.imgCache.has(courseName)) return;
    this.unsplash.firstPhoto(this.keyword(courseName)).subscribe(photo => {
      if (photo) {
        const u = new URL(photo.urls.small);
        u.searchParams.set('utm_source', 'your_app_name');
        u.searchParams.set('utm_medium', 'referral');
        this.imgCache.set(courseName, { url: u.toString(), photo });
      } else {
        this.imgCache.set(courseName, { url: '' });
      }
    });
  }

  courseImage(courseName: string): string | null {
    return this.imgCache.get(courseName)?.url || null;
  }

  // ---------- Filters / Sort ----------
  openFilter(): void {
    this.showFilter = true;
  }

  closeFilter(): void {
    this.showFilter = false;
  }

  closeFilterOnBackdrop(ev: MouseEvent) {
    this.closeFilter();
  }

  hasActiveFilters(): boolean {
    return (
      this.q.trim() !== '' ||
      this.f.minDuration != null ||
      this.f.maxDuration != null ||
      !!this.f.startFrom || !!this.f.startTo ||
      !!this.f.endFrom || !!this.f.endTo
    );
  }

  activeFilterCount(): number {
    let n = 0;
    if (this.q.trim() !== '') n++;
    if (this.f.minDuration != null) n++;
    if (this.f.maxDuration != null) n++;
    if (this.f.startFrom) n++;
    if (this.f.startTo) n++;
    if (this.f.endFrom) n++;
    if (this.f.endTo) n++;
    return n;
  }

  resetFilters(): void {
    this.q = '';
    this.f = {
      q: '',
      minDuration: undefined,
      maxDuration: undefined,
      startFrom: '',
      startTo: '',
      endFrom: '',
      endTo: ''
    };
    this.durationError = undefined;
  }

  submitFilters(): void {
    this.durationError = undefined;

    if (
      this.f.minDuration != null &&
      this.f.maxDuration != null &&
      this.f.minDuration > this.f.maxDuration
    ) {
      this.durationError = 'Min duration cannot be greater than max duration.';
      return;
    }

    // apply filter keyword from modal to main search field
    this.q = this.f.q || '';

    this.closeFilter();
  }

  filtered(): Course[] {
    const t = this.q.trim().toLowerCase();

    let list = this.rows;

    // keyword filter
    if (t) {
      list = list.filter(r =>
        (r.courseName || '').toLowerCase().includes(t) ||
        (r.description || '').toLowerCase().includes(t)
      );
    }

    // duration filter
    if (this.f.minDuration != null) {
      list = list.filter(r => (r.duration ?? 0) >= (this.f.minDuration as number));
    }
    if (this.f.maxDuration != null) {
      list = list.filter(r => (r.duration ?? 0) <= (this.f.maxDuration as number));
    }

    // start date range filter
    if (this.f.startFrom || this.f.startTo) {
      list = list.filter(r => this.inDateRange(r.startDate, this.f.startFrom, this.f.startTo));
    }

    // end date range filter
    if (this.f.endFrom || this.f.endTo) {
      list = list.filter(r => this.inDateRange(r.endDate, this.f.endFrom, this.f.endTo));
    }

    // sorting
    switch (this.sort) {
      case 'name':
        list = [...list].sort((a, b) => (a.courseName || '').localeCompare(b.courseName || ''));
        break;
      case 'duration':
        list = [...list].sort((a, b) => (a.duration ?? 0) - (b.duration ?? 0));
        break;
      default:
        list = [...list].sort(
          (a, b) => new Date(b.startDate || 0).getTime() - new Date(a.startDate || 0).getTime()
        );
    }

    return list;
  }

  private inDateRange(dateStr: string | undefined | null, from: string, to: string): boolean {
    if (!dateStr) return true;
    const d = new Date(dateStr).getTime();
    if (from) {
      const f = new Date(from).getTime();
      if (d < f) return false;
    }
    if (to) {
      const t = new Date(to).getTime();
      if (d > t) return false;
    }
    return true;
  }
daysUntil(c: Course): number | null {
    if (!c.startDate) return null;
    const today = new Date();
    const start = new Date(c.startDate);
    return Math.ceil((start.getTime() - today.getTime()) / (1000*60*60*24));
  }

  started(c: Course): boolean {
    const d = this.daysUntil(c);
    return d !== null && d <= 0;
  }
  // ---------- Navigation ----------
  openDetails(id?: number): void {
    if (id == null) return;
    this.router.navigate(['/course', id]);
  }

  trackById(_: number, c: Course) {
    return c.id;
  }
}
