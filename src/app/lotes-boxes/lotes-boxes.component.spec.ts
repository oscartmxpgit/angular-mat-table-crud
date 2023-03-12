import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotesBoxesComponent } from './lotes-boxes.component';

describe('LotesBoxesComponent', () => {
  let component: LotesBoxesComponent;
  let fixture: ComponentFixture<LotesBoxesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LotesBoxesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LotesBoxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
