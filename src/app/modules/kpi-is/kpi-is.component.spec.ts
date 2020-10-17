import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiIsComponent } from './kpi-is.component';

describe('KpiIsComponent', () => {
  let component: KpiIsComponent;
  let fixture: ComponentFixture<KpiIsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KpiIsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiIsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
