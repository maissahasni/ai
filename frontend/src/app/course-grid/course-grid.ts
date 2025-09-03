import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../models/course.model';
import { CourseService } from '../services/course.service';
import { UnsplashPhoto, UnsplashService } from '../services/unsplash.service';

@Component({
  selector: 'app-course-grid',
  standalone: false,
  templateUrl: './course-grid.html',
  styleUrl: './course-grid.scss'
})
export class CourseGrid  implements OnInit{
loading = false;
  error?: string;
  rows: Course[] = [];

  private imgCache = new Map<string, { url: string; photo?: UnsplashPhoto }>();

  constructor(
    private courses: CourseService,
    private unsplash: UnsplashService,
    private router: Router
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.courses.getAll().subscribe({
      next: (data) => {
        this.rows = data;
        this.loading = false;
        for (const c of this.rows) this.ensureImageFor(c.courseName);
      },
      error: (e) => { this.loading = false; this.error = 'Failed to load courses'; console.error(e); }
    });
  }

  private buildKeyword(name: string): string {
    // better relevance
    return `${name} course education learning classroom`;
  }

  private ensureImageFor(courseName: string): void {
    if (this.imgCache.has(courseName)) return;
    const keyword = this.buildKeyword(courseName);

    this.unsplash.firstPhoto(keyword).subscribe(photo => {
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

  openDetails(id: number | undefined): void {
    if (id == null) return;
    this.router.navigate(['/course', id]);
  }
}
