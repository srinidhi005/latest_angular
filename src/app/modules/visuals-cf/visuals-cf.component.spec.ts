import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualsCfComponent } from './visuals-cf.component';

describe('VisualsCfComponent', () => {
  let component: VisualsCfComponent;
  let fixture: ComponentFixture<VisualsCfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualsCfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualsCfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
