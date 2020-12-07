import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashmetricsComponent } from './cashmetrics.component';

describe('CashmetricsComponent', () => {
  let component: CashmetricsComponent;
  let fixture: ComponentFixture<CashmetricsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashmetricsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashmetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
