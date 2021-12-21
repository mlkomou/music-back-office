import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddArtisteComponent } from './add-artiste.component';

describe('AddArtisteComponent', () => {
  let component: AddArtisteComponent;
  let fixture: ComponentFixture<AddArtisteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddArtisteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddArtisteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
