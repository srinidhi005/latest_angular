import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BsmetricsComponent } from './bsmetrics.component';

describe('BsmetricsComponent', () => {
  let component: BsmetricsComponent;
  let fixture: ComponentFixture<BsmetricsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BsmetricsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BsmetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
