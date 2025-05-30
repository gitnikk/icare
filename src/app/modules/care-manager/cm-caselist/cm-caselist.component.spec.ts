import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmCaselistComponent } from './cm-caselist.component';

describe('CmCaselistComponent', () => {
  let component: CmCaselistComponent;
  let fixture: ComponentFixture<CmCaselistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmCaselistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmCaselistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
