import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PLMetricsComponent } from './plmetrics.component';

describe('PLMetricsComponent', () => {
  let component: PLMetricsComponent;
  let fixture: ComponentFixture<PLMetricsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PLMetricsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PLMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
