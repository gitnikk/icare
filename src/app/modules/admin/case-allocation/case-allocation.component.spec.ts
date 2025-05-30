import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseAllocationComponent } from './case-allocation.component';

describe('CaseAllocationComponent', () => {
  let component: CaseAllocationComponent;
  let fixture: ComponentFixture<CaseAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
