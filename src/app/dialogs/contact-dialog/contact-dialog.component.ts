import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GsheetsContactService } from 'app/services/gsheets-contact.service';

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.css']
})
export class ContactDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ContactDialogComponent>, public gsheetsContactService: GsheetsContactService) { }

  ngOnInit(): void {
  }

  remitenteNombre = "";
  remitenteCorreo = "";
  remitenteTelefono = "";
  mensaje = "";

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

  public enviaMensjSheets(): void {
    const datosContacto = "CaminoEmaus," + this.remitenteNombre + "," + this.remitenteCorreo + "," + this.remitenteTelefono + "," + this.mensaje;
    this.gsheetsContactService.exportToSheets(datosContacto);
    this.dialogRef.close({ res: 'Ok' });
  }

}
