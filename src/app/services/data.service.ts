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

    var worksheet = workbook.addWorksheet('Palet', { properties: { tabColor: { argb: '000000' } } });
    for (let index = 1; index <= this.numCajas; index++) {
      const datosHoja = arrObj.filter(caja => caja.cajaId === index);

      worksheet.columns = [
        { header: 'CAJA Nº', key: 'caja', width: 10, style: { font: { name: 'Arial', color: { argb: '000000' } } } },
        { header: 'PESO CAJA', key: 'pesocaja', width: 10 },
        { header: 'CANTIDAD', key: 'cantidad', width: 10, style: { font: { name: 'Arial', color: { argb: '000000' } } } },
        { header: 'PESO UNITARIO (KGS)', key: 'pesoUnitario', width: 15, style: { font: { name: 'Arial', color: { argb: '000000' } } } },
        { header: 'PESO (KGS)', key: 'peso', width: 10, style: { font: { name: 'Arial', color: { argb: '000000' } } } },
        { header: 'DESCRIPCIÓN', key: 'descripcion', width: 50, style: { font: { name: 'Arial', color: { argb: '000000' } } } },
        { header: 'CATEGORÍA', key: 'categoria', width: 40, style: { font: { name: 'Arial', color: { argb: '000000' } } } },
        { header: 'DESTINATARIO 1', key: 'destinatario1', width: 40, style: { font: { name: 'Arial', color: { argb: '000000' } } } },
        { header: 'DESTINATARIO 2', key: 'destinatario2', width: 40, style: { font: { name: 'Arial', color: { argb: '000000' } } } },
        { header: 'DESTINATARIO 3', key: 'destinatario3', width: 40, style: { font: { name: 'Arial', color: { argb: '000000' } } } },
        { header: 'OBSERVACIONES', key: 'observaciones', width: 40, style: { font: { name: 'Arial', color: { argb: '000000' } } } },
      ];
      for (let index = 0; index < datosHoja.length; index++) {
        const element = datosHoja[index];
        if (index==0){
          worksheet.addRow({ caja: element.cajaId, pesocaja:pesocaja, cantidad: element.cantidad, pesoUnitario: element.pesoUnitario, peso: element.pesoUnitario * element.cantidad, descripcion: element.descripcion, categoria: element.categoria,destinatario1: configSpreadSheet.destinatario1,destinatario2: configSpreadSheet.destinatario2,destinatario3: destinatario3,observaciones: observaciones});
        }
        else{
          worksheet.addRow({ caja: element.cajaId, cantidad: element.cantidad, pesoUnitario: element.pesoUnitario, peso: element.pesoUnitario * element.cantidad, descripcion: element.descripcion, categoria: element.categoria });
        }
      }
      datosHoja.forEach(element => {
      });
      worksheet.addRow();

    }

    const now = new Date();

    let fileName = configSpreadSheet.operacion  + "_" + nombreUsuario + "_" + now.toISOString() + ".xlsx";
    const excelBuffer: any = workbook.xlsx.writeBuffer();
    workbook.xlsx.writeBuffer()
      .then(function (buffer) {
        // done buffering
        const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(data, fileName);
      });
  }


  pesoCajas(): number {
    let peso = 0;
    const arrObj = this.cajasJsonStrToObjArray();
    if (CajasStorage.getItem() != null) {
      arrObj.forEach(element => {
        peso +=  element.pesoUnitario * element.cantidad;
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