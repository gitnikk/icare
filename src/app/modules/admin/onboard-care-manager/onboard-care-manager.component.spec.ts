import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardCareManagerComponent } from './onboard-care-manager.component';

describe('OnboardCareManagerComponent', () => {
  let component: OnboardCareManagerComponent;
  let fixture: ComponentFixture<OnboardCareManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardCareManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardCareManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
