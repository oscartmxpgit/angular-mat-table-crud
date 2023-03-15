import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Lote } from 'app/models/issue';
import { LotesDataService } from 'app/services/lotes-data.service';

@Component({
  selector: 'app-lote-info',
  templateUrl: './lote-info.component.html',
  styleUrls: ['./lote-info.component.css']
})
export class LoteInfoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<LoteInfoComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public lotesDataService: LotesDataService ) { }



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
    lote.remitente = this.data.descripcion;
    this.lotesDataService.addLote(lote);
  }
}
