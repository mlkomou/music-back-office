import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MusiqueOrderComponent } from './musique-order.component';

describe('MusiqueOrderComponent', () => {
  let component: MusiqueOrderComponent;
  let fixture: ComponentFixture<MusiqueOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusiqueOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MusiqueOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
