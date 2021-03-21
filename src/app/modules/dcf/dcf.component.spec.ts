import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcfComponent } from './dcf.component';

describe('DcfComponent', () => {
  let component: DcfComponent;
  let fixture: ComponentFixture<DcfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DcfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DcfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
