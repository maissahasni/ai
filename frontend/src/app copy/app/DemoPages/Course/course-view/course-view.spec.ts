import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseView } from './course-view';

describe('CourseView', () => {
  let component: CourseView;
  let fixture: ComponentFixture<CourseView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CourseView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
