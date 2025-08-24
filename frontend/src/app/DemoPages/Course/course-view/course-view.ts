import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/models/course.model';
import { CourseService } from 'src/app/services/course.service';
import { UnsplashService, UnsplashPhoto } from 'src/app/services/unsplash.service';

@Component({
  selector: 'app-course-view',
  standalone: false,
  templateUrl: './course-view.html',
  styleUrls: ['./course-view.scss']
})
export class CourseView implements OnInit {
  rows: Course[] = [];
  loading = false;
  error?: string;

  // modal state
  showForm = false;

  // per-card inline edit state
  editId: number | null = null;
  editRow: Course | null = null;

  // image cache per courseName
  private imgCache = new Map<string, { url: string; photo?: UnsplashPhoto }>();

  constructor(
    private courses: CourseService,
    private unsplash: UnsplashService
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = undefined;
    this.courses.getAll().subscribe({
      next: (data) => {
        this.rows = data;
        this.loading = false;

        // warm up images (non-blocking)
        for (const c of this.rows) {
          this.ensureImageFor(c.courseName);
        }
      },
      error: (e) => { this.loading = false; this.error = 'Failed to load courses'; console.error(e); }
    });
  }

  // ========== Images ==========
  private ensureImageFor(courseName: string): void {
  if (this.imgCache.has(courseName)) return;

  const keyword = `${courseName}`; // << add "course"

  this.unsplash.imageUrlFor(keyword, 'regular').subscribe(url => {
    if (url) {
      this.imgCache.set(courseName, { url });
    } else {
      this.imgCache.set(courseName, { url: '' });
    }
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

  // If you want to “use/confirm” the image and track the download with Unsplash
  useImage(courseName: string): void {
    const entry = this.imgCache.get(courseName);
    if (entry?.photo) {
      this.unsplash.trackDownload(entry.photo.links.download_location).subscribe();
    }
  }

  // ========== Add ==========
  openAddForm(): void { this.showForm = true; }
  closeForm(): void { this.showForm = false; }

  handleSaved(newCourse: Course): void {
    this.loading = true;
    this.courses.create(newCourse).subscribe({
      next: () => {
        this.showForm = false;
        this.load();
      },
      error: (e) => { this.loading = false; this.error = 'Create failed'; console.error(e); }
    });
  }

  // ========== Update ==========
  startEdit(row: Course): void {
    this.editId = row.id!;
    this.editRow = { ...row };
  }

  cancelEdit(): void {
    this.editId = null;
    this.editRow = null;
  }

  saveEdit(): void {
    if (!this.editRow || !this.editId) return;
    this.loading = true;
    this.courses.update(this.editId, this.editRow).subscribe({
      next: () => { this.cancelEdit(); this.load(); },
      error: (e) => { this.loading = false; this.error = 'Update failed'; console.error(e); }
    });
  }

  // ========== Delete ==========
  remove(id: number): void {
    if (!confirm('Delete this course?')) return;
    this.loading = true;
    this.courses.delete(id).subscribe({
      next: () => this.load(),
      error: (e) => { this.loading = false; this.error = 'Delete failed'; console.error(e); }
    });
  }
}
