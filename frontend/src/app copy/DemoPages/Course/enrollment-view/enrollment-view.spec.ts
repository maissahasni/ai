import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentView } from './enrollment-view';

describe('EnrollmentView', () => {
  let component: EnrollmentView;
  let fixture: ComponentFixture<EnrollmentView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnrollmentView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
