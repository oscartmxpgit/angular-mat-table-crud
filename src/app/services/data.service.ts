import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Issue } from '../models/issue';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as FileSaver from 'file-saver';
import { configSpreadSheet } from 'assets/config';

@Injectable()
export class DataService {
  //private readonly API_URL = 'https://api.github.com/repos/angular/angular/issues';
  private readonly API_URdatosComboBoxes = './assets/datosComboBoxes.json';

  dataChange: BehaviorSubject<Issue[]> = new BehaviorSubject<Issue[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  cajasData: any;
  numCajas: number;

  constructor(private httpClient: HttpClient) { }

  getDatosComboBoxes(): any {
    this.httpClient.get<any>(this.API_URdatosComboBoxes).subscribe(data => {
      return data;
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }


  get data(): Issue[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  getNumCajas(): any {
    if (CajasStorage.getItem() === null) {
      this.numCajas = 1;
    }
    else {
      const arrObj = this.cajasJsonStrToObjArray();
      if (arrObj.length > 0) {
        this.numCajas = Math.max(...arrObj.map(o => o.cajaId));
      }
      else {
        this.numCajas = 1;
      }
    }
  }

  cajasJsonStrToObjArray(): Issue[] {
    const cajData = CajasStorage.getItem();
    var obj = eval(cajData);
    var res = [];
    for (var i in obj)
      res.push(obj[i]);
    return res;
  }

  /** CRUD METHODS */
  getIssuesPorCaja(indiceCajaSel: string): void {
    const arrObj = this.cajasJsonStrToObjArray();
    this.dataChange.next(arrObj.filter(caja => caja.cajaId === +indiceCajaSel));
  }

  exportToExcel(nombreUsuario, pesocaja, destinatario3, observaciones): void {
    var options = {
      filename: 'MisCajas.xlsx',
      useStyles: true,
      useSharedStrings: true
    };

    // workbook.creator = 'Me';
    // workbook.lastModifiedBy = 'Her';
    // workbook.created = new Date(1985, 8, 30);
    // workbook.modified = new Date();
    // workbook.lastPrinted = new Date(2016, 9, 27);
    // create a sheet with red tab colour

    let workbook = new Excel.Workbook(options);

    const arrObj = this.cajasJsonStrToObjArray();

    var worksheet = workbook.addWorksheet('Cajas', { properties: { tabColor: { argb: '000000' } } });

    const now = new Date();
    /*TITLE*/
    worksheet.mergeCells('A1', 'C1');
    worksheet.mergeCells('A2', 'C2');
    worksheet.mergeCells('A3', 'C3');
    worksheet.mergeCells('A4', 'C4');

    worksheet.mergeCells('D1', 'F1');
    worksheet.mergeCells('D2', 'F2');
    worksheet.mergeCells('D3', 'F3');
    worksheet.mergeCells('D4', 'F4');

    worksheet.getCell('A1').value = 'Operación:';
    worksheet.getCell('A2').value = 'Fecha de operación:';
    worksheet.getCell('A3').value = 'Observaciones:';

    worksheet.getCell('D1').value = configSpreadSheet.operacionNombreCompleto;
    worksheet.getCell('D2').value = now.toISOString();


    /*Column headers*/
    worksheet.getRow(5).values = ['CAJA Nº', 'PESO CAJA (Kgs)', 'CANTIDAD', 'PESO UNITARIO (Kgs)', 'PESO (Kgs)', 'DESCRIPCIÓN', 'CATEGORÍA', 'DESTINATARIO 1', 'DESTINATARIO 2', 'DESTINATARIO 3', 'OBSERVACIONES'];

    /*Define your column keys because this is what you use to insert your data according to your columns, they're column A, B, C, D respectively being idClient, Name, Tel, and Adresse.
    So, it's pretty straight forward */
    worksheet.columns = [
      { key: 'caja', width: 10 },
      { key: 'pesocaja', width: 10 },
      { key: 'cantidad', width: 10 },
      { key: 'pesoUnitario', width: 10 },
      { key: 'peso', width: 10 },
      { key: 'descripcion', width: 20 },
      { key: 'categoria', width: 20 },
      { key: 'destinatario1', width: 30 },
      { key: 'destinatario2', width: 30 },
      { key: 'destinatario3', width: 30 },
      { key: 'observaciones', width: 40 },
    ];

    for (let index = 1; index <= this.numCajas; index++) {
      const datosHoja = arrObj.filter(caja => caja.cajaId === index);

      for (let index = 0; index < datosHoja.length; index++) {
        const element = datosHoja[index];
        if (index == 0) {
          worksheet.addRow({ caja: element.cajaId, pesocaja: this.pesoCajaIndividual(element.cajaId), cantidad: +element.cantidad, pesoUnitario: +element.pesoUnitario, peso: element.pesoUnitario * element.cantidad, descripcion: element.descripcion, categoria: element.categoria, destinatario1: configSpreadSheet.destinatario1, destinatario2: configSpreadSheet.destinatario2, destinatario3: destinatario3, observaciones: observaciones });
        }
        else {
          worksheet.addRow({ cantidad: +element.cantidad, pesoUnitario: +element.pesoUnitario, peso: element.pesoUnitario * element.cantidad, descripcion: element.descripcion, categoria: element.categoria });
        }
      }
      datosHoja.forEach(element => {
      });
      worksheet.addRow();

    }

    let fileName = configSpreadSheet.operacion + "_" + nombreUsuario + "_" + now.toISOString() + ".xlsx";
    const excelBuffer: any = workbook.xlsx.writeBuffer();
    workbook.xlsx.writeBuffer()
      .then(function (buffer) {
        // done buffering
        const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(data, fileName);
      });
  }

  pesoCajaIndividual(cajaId: number): number {
    let peso = 0;
    const arrObj = this.cajasJsonStrToObjArray();
    if (CajasStorage.getItem() != null) {
      arrObj.forEach(element => {
        if (element.cajaId == cajaId) {
          peso += element.pesoUnitario * element.cantidad;
        }
      });
    }
    return peso;
  }


  pesoCajas(): number {
    let peso = 0;
    const arrObj = this.cajasJsonStrToObjArray();
    if (CajasStorage.getItem() != null) {
      arrObj.forEach(element => {
        peso += element.pesoUnitario * element.cantidad;
      });
    }
    return peso;
  }

  addIssue(issue: Issue): void {
    let maxId = 0;
    const arrObj = this.cajasJsonStrToObjArray();
    if (CajasStorage.getItem() != null) {
      maxId = Math.max(...arrObj.map(o => o.id));
    }

    issue.id = maxId + 1;
    arrObj.push(issue);
    this.persistArray(arrObj);
  }

  updateIssue(issue: Issue): void {
    let arrObj = this.cajasJsonStrToObjArray();

    for (let index = 0; index < arrObj.length; index++) {
      const element = arrObj[index];
      if (element.id === issue.id) {
        arrObj[index] = issue;
        break;
      }
    }
    this.persistArray(arrObj);
  }

  deleteIssue(id: number): void {
    console.log(id);
    let arrObj = this.cajasJsonStrToObjArray();
    const filtObj = arrObj.filter(obj => obj.id !== id);
    this.persistArray(filtObj);
  }

  deleteAll() {
    CajasStorage.removeItem();
  }

  persistArray(arrObj) {
    const strObj = JSON.stringify(arrObj);
    CajasStorage.setItem(strObj);
  }

}

var CajasStorage = {

  getItem: function () {
    return localStorage.getItem("CajasValues");
  },

  setItem: function (value) {
    localStorage.setItem("CajasValues", value);
  },

  removeItem: function () {
    return localStorage.removeItem("CajasValues");
  }

}