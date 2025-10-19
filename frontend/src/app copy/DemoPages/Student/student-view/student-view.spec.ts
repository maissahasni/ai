import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentView } from './student-view';

describe('StudentView', () => {
  let component: StudentView;
  let fixture: ComponentFixture<StudentView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
