import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontHeader } from './front-header';

describe('FrontHeader', () => {
  let component: FrontHeader;
  let fixture: ComponentFixture<FrontHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FrontHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrontHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
