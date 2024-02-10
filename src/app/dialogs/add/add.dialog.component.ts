import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormControl, Validators } from '@angular/forms';
import { Issue } from '../../models/issue';
import { comboData } from '../../models/datosComboBoxes';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add.dialog',
  templateUrl: '../../dialogs/add/add.dialog.html',
  styleUrls: ['../../dialogs/add/add.dialog.css']
})

export class AddDialogComponent {
  @ViewChild('cantidad', { static: false }) cantidadInputRef: ElementRef;
  @ViewChild('pesoUnitario', { static: false }) pesoUnitarioInputRef: ElementRef;
  @ViewChild('descripcion', { static: false }) descripcionInputRef: ElementRef;

  comboData = comboData;
  //datosComboBoxes.ts
  constructor(public dialogRef: MatDialogRef<AddDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: Issue,
    public dataService: DataService) { 
      this.data.descripcion = '(sin descripción)';
    }

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Campo requerido' :
      this.formControl.hasError('email') ? 'Correo electrónico no válido' :
        '';
  }

  submit() {
    // empty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.dataService.addIssue(this.data);
    this.cantidadInputRef.nativeElement.value = '';
    this.pesoUnitarioInputRef.nativeElement.value = '';
    this.data.cantidad = 0;
    this.data.pesoUnitario = 0;
    this.data.descripcion = '(sin descripción)';

  }

  public confirmAddClose(): void {
    this.dataService.addIssue(this.data);
    this.cantidadInputRef.nativeElement.value = null;
    this.pesoUnitarioInputRef.nativeElement.value = null;
    this.descripcionInputRef.nativeElement.value = null;
    this.data.cantidad = undefined;
    this.data.pesoUnitario = undefined;
    this.data.descripcion = undefined;
    this.dialogRef.close();
  }
}
