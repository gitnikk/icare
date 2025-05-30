import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardDoctorComponent } from './onboard-doctor.component';

describe('OnboardDoctorComponent', () => {
  let component: OnboardDoctorComponent;
  let fixture: ComponentFixture<OnboardDoctorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardDoctorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
