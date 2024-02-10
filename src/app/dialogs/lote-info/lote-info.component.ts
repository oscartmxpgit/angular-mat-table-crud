import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Lote } from 'app/models/issue';
import { LotesDataService } from 'app/services/lotes-data.service';

@Component({
  selector: 'app-lote-info',
  templateUrl: './lote-info.component.html',
  styleUrls: ['./lote-info.component.css']
})
export class LoteInfoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<LoteInfoComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public lotesDataService: LotesDataService,
  private _snackBar: MatSnackBar, ) { }



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

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  stopEdit(): void {
    let lote = new Lote();
    lote.loteId=this.data.loteId;
    lote.remitente = this.data.remitente;
    this.lotesDataService.addLote(lote);
    this._snackBar.open('Lote añadido', 'Ok', {
      duration: 2000,
    });
  }
}
