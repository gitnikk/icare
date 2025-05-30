import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFamilyMemberComponent } from './manage-family-member.component';

describe('ManageFamilyMemberComponent', () => {
  let component: ManageFamilyMemberComponent;
  let fixture: ComponentFixture<ManageFamilyMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageFamilyMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageFamilyMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
