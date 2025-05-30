import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorCaselistComponent } from './doctor-caselist.component';

describe('DoctorCaselistComponent', () => {
  let component: DoctorCaselistComponent;
  let fixture: ComponentFixture<DoctorCaselistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorCaselistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorCaselistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
