import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseGrid } from './course-grid';

describe('CourseGrid', () => {
  let component: CourseGrid;
  let fixture: ComponentFixture<CourseGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CourseGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
