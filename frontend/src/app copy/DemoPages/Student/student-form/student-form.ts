import { Component, EventEmitter, Output } from '@angular/core';
import { Student } from 'src/app/models/student.model';

@Component({
  selector: 'app-student-form',
  standalone: false,
  templateUrl: './student-form.html',
  styleUrls: ['./student-form.scss']
})
export class StudentForm {
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Student>();
  model: Student = { firstName: '', lastName: '', email: '', dateOfBirth: '',registrationDate:'' };
  error?: string;


  save(): void {
    const { firstName, lastName, email, dateOfBirth } = this.model;
    if (!firstName || !lastName || !email || !dateOfBirth) {
    this.error = 'All fields are required';
    return;
    }
    this.saved.emit(this.model);
  }

}
