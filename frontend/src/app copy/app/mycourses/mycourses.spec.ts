import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mycourses } from './mycourses';

describe('Mycourses', () => {
  let component: Mycourses;
  let fixture: ComponentFixture<Mycourses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Mycourses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mycourses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
