import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiCashflowComponent } from './kpi-cashflow.component';

describe('KpiCashflowComponent', () => {
  let component: KpiCashflowComponent;
  let fixture: ComponentFixture<KpiCashflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiCashflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiCashflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
