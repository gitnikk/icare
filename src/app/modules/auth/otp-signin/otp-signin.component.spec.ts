import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpSigninComponent } from './otp-signin.component';

describe('OtpSigninComponent', () => {
  let component: OtpSigninComponent;
  let fixture: ComponentFixture<OtpSigninComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtpSigninComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
