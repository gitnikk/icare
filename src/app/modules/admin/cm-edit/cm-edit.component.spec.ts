import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmEditComponent } from './cm-edit.component';

describe('CmEditComponent', () => {
  let component: CmEditComponent;
  let fixture: ComponentFixture<CmEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
