import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmProfileComponent } from './cm-profile.component';

describe('CmProfileComponent', () => {
  let component: CmProfileComponent;
  let fixture: ComponentFixture<CmProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
