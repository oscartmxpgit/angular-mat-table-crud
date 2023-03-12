import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { comboData } from 'app/models/datosComboBoxes';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-datos-usuario',
  templateUrl: './datos-usuario.component.html',
  styleUrls: ['./datos-usuario.component.css']
})
export class DatosUsuarioComponent implements OnInit {
  pesoCajaCalculado =0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dataService: DataService, public dialogRef: MatDialogRef<DatosUsuarioComponent>,) { }

  pesoLotesUsr: 0;
  nombreUsuario: "";
  destinatario3: "";
  observaciones: "";

  pesodiff=0;
  mensajeErrForm: "";

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);


  onNoClick(): void {
    this.dialogRef.close();
  }


  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Campo requerido' :
      this.formControl.hasError('email') ? 'Correo electrónico no válido' :
        '';
  }

  submit() {
    // empty stuff
  }

  ngOnInit(): void {
  }

  public confirmExport(): void {
    this.pesoCajaCalculado= this.dataService.pesoCajas(this.data.currentLote);
    this.pesodiff= Math.abs(this.pesoLotesUsr - this.pesoCajaCalculado);
    if ( this.pesodiff <= 1 )
    {
      this.dataService.exportToExcel(this.data.currentLote, this.nombreUsuario, this.pesoLotesUsr, this.destinatario3, this.observaciones);
      this.dialogRef.close();
    }
  }


}
