import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyMatricsComponent } from './company-matrics.component';

describe('CompanyMatricsComponent', () => {
  let component: CompanyMatricsComponent;
  let fixture: ComponentFixture<CompanyMatricsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyMatricsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyMatricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
