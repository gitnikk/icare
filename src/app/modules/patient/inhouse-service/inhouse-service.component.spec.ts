import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InhouseServiceComponent } from './inhouse-service.component';

describe('InhouseServiceComponent', () => {
  let component: InhouseServiceComponent;
  let fixture: ComponentFixture<InhouseServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InhouseServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InhouseServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
