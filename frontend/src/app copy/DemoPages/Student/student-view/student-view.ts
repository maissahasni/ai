import { Component, OnInit } from '@angular/core';
import { Student } from 'src/app/models/student.model';
import { StudentService } from 'src/app/services/students.service';

@Component({
  selector: 'app-student-view',
  standalone: false,
  templateUrl: './student-view.html',
  styleUrls: ['./student-view.scss']
})
export class StudentView implements OnInit{
  rows: Student[] = [];
  loading = false;
  error?: string;
  showForm = false;
  editId: number | null = null;
  editRow: Student | null = null;
  constructor(private students: StudentService) {}
  ngOnInit(): void { this.load(); }
  load(): void {
    this.loading = true;
    this.error = undefined;
    this.students.getAll().subscribe({
      next: (data) => { this.rows = data; this.loading = false; },
      error: (e) => { this.loading = false; this.error = 'Failed to load students'; console.error(e); }
    });
  }
  avatarUrl(firstName?: string): string {
    const seed = encodeURIComponent(firstName || 'Student');
    return `https://api.dicebear.com/9.x/bottts/svg?seed=${seed}`;
  }
  openAddForm(): void { this.showForm = true; }
  closeForm(): void { this.showForm = false; }
  handleSaved(newStudent: Student): void {
    this.loading = true;
    this.students.create(newStudent).subscribe({
      next: () => { this.showForm = false; this.load(); },
      error: (e) => { this.loading = false; this.error = 'Create failed'; console.error(e); }
    });
  }
  startEdit(row: Student): void {
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
    this.students.update(this.editId, this.editRow).subscribe({
    next: () => { this.cancelEdit(); this.load(); },
    error: (e) => { this.loading = false; this.error = 'Update failed'; console.error(e); }
    });
  }
  remove(id: number): void {
    if (!confirm('Delete this student?')) return;
    this.loading = true;
    this.students.delete(id).subscribe({
    next: () => this.load(),
    error: (e) => { this.loading = false; this.error = 'Delete failed'; console.error(e); }
    });
  }

}
