import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PesosCajasComponent } from './pesos-cajas.component';

describe('PesosCajasComponent', () => {
  let component: PesosCajasComponent;
  let fixture: ComponentFixture<PesosCajasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PesosCajasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PesosCajasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
