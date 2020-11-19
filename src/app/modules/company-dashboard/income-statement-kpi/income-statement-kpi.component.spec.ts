import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeStatementKpiComponent } from './income-statement-kpi.component';

describe('IncomeStatementKpiComponent', () => {
  let component: IncomeStatementKpiComponent;
  let fixture: ComponentFixture<IncomeStatementKpiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomeStatementKpiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeStatementKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
