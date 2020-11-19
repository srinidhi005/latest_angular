import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceSheetKpiComponent } from './balance-sheet-kpi.component';

describe('BalanceSheetKpiComponent', () => {
  let component: BalanceSheetKpiComponent;
  let fixture: ComponentFixture<BalanceSheetKpiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceSheetKpiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceSheetKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
