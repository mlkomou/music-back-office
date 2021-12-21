import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MusiqueOrdersComponent } from './musique-orders.component';

describe('MusiqueOrdersComponent', () => {
  let component: MusiqueOrdersComponent;
  let fixture: ComponentFixture<MusiqueOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusiqueOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MusiqueOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
