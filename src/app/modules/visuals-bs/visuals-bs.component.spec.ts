import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualsBsComponent } from './visuals-bs.component';

describe('VisualsBsComponent', () => {
  let component: VisualsBsComponent;
  let fixture: ComponentFixture<VisualsBsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualsBsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualsBsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
