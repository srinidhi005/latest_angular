import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualsISComponent } from './visuals-is.component';

describe('VisualsISComponent', () => {
  let component: VisualsISComponent;
  let fixture: ComponentFixture<VisualsISComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualsISComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualsISComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
