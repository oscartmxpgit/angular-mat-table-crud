import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLoteInfoDialogComponent } from './edit-lote-info-dialog.component';

describe('EditLoteInfoDialogComponent', () => {
  let component: EditLoteInfoDialogComponent;
  let fixture: ComponentFixture<EditLoteInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLoteInfoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLoteInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
