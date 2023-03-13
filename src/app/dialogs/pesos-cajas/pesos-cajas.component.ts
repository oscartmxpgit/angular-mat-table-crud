import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { comboData } from 'app/models/datosComboBoxes';
import { Caja } from 'app/models/issue';
import { CajasDataService } from 'app/services/cajas-data.service';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-pesos-cajas',
  templateUrl: './pesos-cajas.component.html',
  styleUrls: ['./pesos-cajas.component.css']
})
export class PesosCajasComponent implements OnInit {
  cajasDatabase: DataService;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public httpClient: HttpClient, public cajasDataService: CajasDataService, public dialogRef: MatDialogRef<PesosCajasComponent>,) { }
  ngOnInit(): void {
    this.loadData();
  }

  public loadData() {
    //this.cajasDatabase = new DataService(this.httpClient);
    this.dataSource = this.cajasDataService.getData();
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

  public confirmPesos(): void {
    this.cajasDataService.establecerCajas(this.data);
  }

  displayedColumns = ['loteId', 'cajaId', 'peso', 'observaciones'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}

const ELEMENT_DATA: Caja[] = [
  { loteId: 1, cajaId: 4, peso: 134, observaciones: '' },
  { loteId: 2, cajaId: 5, peso: 54, observaciones: '' },
  { loteId: 3, cajaId: 6, peso: 94, observaciones: '' },
];
