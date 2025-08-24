import { Component, EventEmitter, Output } from '@angular/core';
import { Course } from 'src/app/models/course.model';

@Component({
  selector: 'app-course-form',
  standalone: false,
  templateUrl: './course-form.html',
  styleUrls: ['./course-form.scss']
})
export class CourseForm {
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Course>();

  model: Course = {
    courseName: '',
    description: '',
    duration: 1,
    startDate: '',
    endDate: ''
  };

  error?: string;

  save(): void {
    const { courseName, description, duration, startDate, endDate } = this.model;

    if (!courseName || !description || !duration || !startDate || !endDate) {
      this.error = 'All fields are required';
      return;
    }
    if (duration <= 0) {
      this.error = 'Duration must be a positive number';
      return;
    }
    if (endDate < startDate) {
      this.error = 'End date must be after start date';
      return;
    }

    this.saved.emit(this.model);
  }
}
