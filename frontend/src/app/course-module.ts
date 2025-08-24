import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseView } from './DemoPages/Course/course-view/course-view';
import { CourseForm } from './DemoPages/Course/course-form/course-form';
import { SharedModule } from './shared.module';



@NgModule({
  declarations: [
    CourseView,
    CourseForm
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
