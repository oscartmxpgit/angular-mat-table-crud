import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LotesDataService } from 'app/services/lotes-data.service';

@Component({
  selector: 'app-edit-lote-info-dialog',
  templateUrl: './edit-lote-info-dialog.component.html',
  styleUrls: ['./edit-lote-info-dialog.component.css']
})
export class EditLoteInfoDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EditLoteInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public lotesDataService: LotesDataService,
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
  }

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Campo requerido' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit() {
    // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  stopEdit(): void {
    this.lotesDataService.updateLote(this.data.loteId, this.data.remitente);
  }
}
