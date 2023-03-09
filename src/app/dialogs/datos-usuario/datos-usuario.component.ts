import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-datos-usuario',
  templateUrl: './datos-usuario.component.html',
  styleUrls: ['./datos-usuario.component.css']
})
export class DatosUsuarioComponent implements OnInit {

  constructor(public dataService: DataService, public dialogRef: MatDialogRef<DatosUsuarioComponent>,) { }

  nombreUsuario: "";

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
    this.dataService.exportToExcel(this.nombreUsuario);
  }


}
