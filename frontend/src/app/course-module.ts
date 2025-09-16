import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseView } from './DemoPages/Course/course-view/course-view';
import { CourseForm } from './DemoPages/Course/course-form/course-form';
import { SharedModule } from './shared.module';
import { EnrollmentView } from './DemoPages/Course/enrollment-view/enrollment-view';



@NgModule({
  declarations: [
    CourseView,
    CourseForm,
    EnrollmentView
  ],
  imports: [
    SharedModule
  ],
  exports: [
    CourseView,
    CourseForm
  ]
})
export class CourseModule { }
