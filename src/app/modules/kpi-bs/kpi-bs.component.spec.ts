import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiBsComponent } from './kpi-bs.component';

describe('KpiBsComponent', () => {
  let component: KpiBsComponent;
  let fixture: ComponentFixture<KpiBsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KpiBsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiBsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
