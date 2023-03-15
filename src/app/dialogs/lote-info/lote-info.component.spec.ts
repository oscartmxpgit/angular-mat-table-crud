import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoteInfoComponent } from './lote-info.component';

describe('LoteInfoComponent', () => {
  let component: LoteInfoComponent;
  let fixture: ComponentFixture<LoteInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoteInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoteInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
