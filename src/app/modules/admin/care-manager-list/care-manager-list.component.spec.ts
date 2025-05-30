import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CareManagerListComponent } from './care-manager-list.component';

describe('CareManagerListComponent', () => {
  let component: CareManagerListComponent;
  let fixture: ComponentFixture<CareManagerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CareManagerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CareManagerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
