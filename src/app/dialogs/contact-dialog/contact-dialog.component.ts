import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GsheetsContactService } from 'app/services/gsheets-contact.service';
import { DatosUsuarioComponent } from '../datos-usuario/datos-usuario.component';

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.css']
})
export class ContactDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DatosUsuarioComponent>, public gsheetsContactService: GsheetsContactService) { }

  ngOnInit(): void {
  }

  remitente = "";
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
    const datosContacto= "Kosmodromo," + this.remitente + ","+this.mensaje;
    this.gsheetsContactService.exportToSheets(datosContacto);
    this.dialogRef.close({ res: 'Ok' });
  }

}
