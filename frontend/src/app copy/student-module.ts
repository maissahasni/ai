import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentView } from './DemoPages/Student/student-view/student-view';
import { StudentForm } from './DemoPages/Student/student-form/student-form';
import { SharedModule } from './shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    StudentView,
    StudentForm
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
    
  ],
  exports: [
    StudentView,
    StudentForm
  ]
})
export class StudentModule { }
