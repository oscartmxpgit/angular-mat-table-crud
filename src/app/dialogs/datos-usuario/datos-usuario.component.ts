import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { comboData } from 'app/models/datosComboBoxes';
import { Caja } from 'app/models/issue';
import { CajasDataService } from 'app/services/cajas-data.service';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-datos-usuario',
  templateUrl: './datos-usuario.component.html',
  styleUrls: ['./datos-usuario.component.css']
})
export class DatosUsuarioComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dataService: DataService, public cajasDataService: CajasDataService,
    public dialogRef: MatDialogRef<DatosUsuarioComponent>,) { }

  nombreUsuario: "";
  destinatario3: "";
  observaciones: "";

  cajasConProb = "";
  cajasNoIntroducidas = "";
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
    let cajasLoteUsr = this.cajasDataService.cajasLoteUsr(this.data.currentLote); //Caja, CajasDataValues
    let pesodiff = 0;
    let puedeExportar = false;
    let pesoAcorde = true;

    let cajasUsrIds: Caja[] = [];

    this.cajasConProb = "";
    cajasLoteUsr.forEach(caja => {
      let cajaUsr = new Caja();
      cajaUsr.loteId = +caja.loteId;
      cajaUsr.cajaId = caja.cajaId;
      cajaUsr.peso = 0;
      cajaUsr.observaciones = "";

      const arrObjFiltLoteId = cajasUsrIds.filter(c => c.loteId == caja.loteId);
      const arrObjFiltCajaId = arrObjFiltLoteId.filter(c => c.cajaId == caja.cajaId);

      if (arrObjFiltCajaId.length === 0) {
        cajasUsrIds.push(cajaUsr);
      }

      let pesoCajaCalculado = this.dataService.pesoCajasCalculado(this.data.currentLote, caja.cajaId); //number, CajasValues
      pesodiff = Math.abs(caja.peso - pesoCajaCalculado);
      if (pesodiff > 2) {
        pesoAcorde = false;
        this.cajasConProb += "Caja" + caja.cajaId + ", diferencencia de peso: " + pesodiff + "Kgs. ";
      }
    });

    if (this.cajasConProb.trim.length > 0) {
      this.cajasConProb = this.cajasConProb.slice(0, -1);
    }

    let cajasIntroducidas = this.dataService.cajasIntroducidas(this.data.currentLote);

    const arrIgl = cajasIntroducidas.sort().join(',') === cajasUsrIds.sort().join(',');

    if (!(arrIgl)) {
      this.cajasNoIntroducidas = "¡Hay cajas no introducidas!";
    }

    puedeExportar = pesoAcorde && arrIgl;

    if (puedeExportar) {
      let pesoTotalLote = 0;
      cajasLoteUsr.forEach(caja => {
        pesoTotalLote += caja.peso;
      });

      this.dataService.exportToExcel(this.data.currentLote, this.nombreUsuario, pesoTotalLote, this.destinatario3, this.observaciones);
      this.dialogRef.close();
    }
  }

}
