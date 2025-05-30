import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientCaseDetailsComponent } from './patient-case-details.component';

describe('PatientCaseDetailsComponent', () => {
  let component: PatientCaseDetailsComponent;
  let fixture: ComponentFixture<PatientCaseDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientCaseDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientCaseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
