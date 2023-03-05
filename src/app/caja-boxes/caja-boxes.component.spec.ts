import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CajaBoxesComponent } from './caja-boxes.component';

describe('CajaBoxesComponent', () => {
  let component: CajaBoxesComponent;
  let fixture: ComponentFixture<CajaBoxesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CajaBoxesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CajaBoxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
