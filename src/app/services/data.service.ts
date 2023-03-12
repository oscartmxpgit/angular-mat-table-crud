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
  lotesData: any;
  numLotes: number;

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

  getNumLotes(): any {
    if (LotesStorage.getItem() === null) {
      this.numLotes = 1;
    }
    else {
      const arrObj = this.lotesJsonStrToObjArray();
      if (arrObj.length > 0) {
        this.numLotes = Math.max(...arrObj.map(o => o.loteId));
      }
      else {
        this.numLotes = 1;
      }
    }
  }

  lotesJsonStrToObjArray(): Issue[] {
    const cajData = LotesStorage.getItem();
    var obj = eval(cajData);
    var res = [];
    for (var i in obj)
      res.push(obj[i]);
    return res;
  }

  /** CRUD METHODS */
  getIssuesPorLote(indiceLoteSel: string): void {
    const arrObj = this.lotesJsonStrToObjArray();
    this.dataChange.next(arrObj.filter(lote => lote.loteId === +indiceLoteSel));
  }

  exportToExcel(nombreUsuario, pesoLotesUsr, destinatario3, observacionesExcel): void {
    var options = {
      filename: 'MisLotes.xlsx',
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

    const arrObj = this.lotesJsonStrToObjArray();

    var worksheet = workbook.addWorksheet('Lotes', { properties: { tabColor: { argb: '000000' } } });

    const now = new Date();
    /*TITLE*/
    worksheet.mergeCells('A1', 'C1');
    worksheet.mergeCells('A2', 'C2');
    worksheet.mergeCells('A3', 'C3');
    worksheet.mergeCells('A4', 'C4');
    worksheet.mergeCells('A5', 'C5');
    worksheet.mergeCells('A6', 'C6');

    worksheet.mergeCells('D1', 'F1');
    worksheet.mergeCells('D2', 'F2');
    worksheet.mergeCells('D3', 'F3');
    worksheet.mergeCells('D4', 'F4');
    worksheet.mergeCells('D5', 'F5');
    worksheet.mergeCells('D6', 'F6');

    worksheet.getCell('A1').value = 'Operación:';
    worksheet.getCell('A2').value = 'Fecha de operación:';
    worksheet.getCell('A3').value = 'Remitente:';
    worksheet.getCell('A4').value = 'Peso total (usuario):';
    worksheet.getCell('A5').value = 'Observaciones:';

    worksheet.getCell('D1').value = configSpreadSheet.operacionNombreCompleto;
    worksheet.getCell('D2').value = now.toISOString();
    worksheet.getCell('D3').value = nombreUsuario;
    worksheet.getCell('D4').value = pesoLotesUsr;
    worksheet.getCell('D5').value = observacionesExcel;


    /*Column headers*/
    worksheet.getRow(8).values = ['CAJA Nº', 'PESO CAJA (Kgs)', 'CANTIDAD', 'PESO UNITARIO (Kgs)', 'PESO (Kgs)', 'DESCRIPCIÓN', 'CATEGORÍA', 'DESTINATARIO 1', 'DESTINATARIO 2', 'DESTINATARIO 3', 'OBSERVACIONES'];

    /*Define your column keys because this is what you use to insert your data according to your columns, they're column A, B, C, D respectively being idClient, Name, Tel, and Adresse.
    So, it's pretty straight forward */
    worksheet.columns = [
      { key: 'lote', width: 10, style: { font: { name: 'Arial Black', color: { argb: '808080' } } } },
      { key: 'pesolote', width: 10, style: { font: { name: 'Arial Black', color: { argb: '808080' } } } },
      { key: 'cantidad', width: 10, style: { font: { name: 'Arial Black', color: { argb: '808080' } } } },
      { key: 'pesoUnitario', width: 10, style: { font: { name: 'Arial Black', color: { argb: '808080' } } } },
      { key: 'peso', width: 10, style: { font: { name: 'Arial Black', color: { argb: '808080' } } } },
      { key: 'descripcion', width: 20, style: { font: { name: 'Arial Black', color: { argb: '808080' } } } },
      { key: 'categoria', width: 20, style: { font: { name: 'Arial Black', color: { argb: '808080' } } } },
      { key: 'destinatario1', width: 30, style: { font: { name: 'Arial Black', color: { argb: '808080' } } } },
      { key: 'destinatario2', width: 30, style: { font: { name: 'Arial Black', color: { argb: '808080' } } } },
      { key: 'destinatario3', width: 30, style: { font: { name: 'Arial Black', color: { argb: '808080' } } } },
      { key: 'observaciones', width: 40, style: { font: { name: 'Arial Black', color: { argb: '808080' } } } },
    ];

    for (let index = 1; index <= this.numLotes; index++) {
      const datosHoja = arrObj.filter(lote => lote.loteId === index);

      for (let index = 0; index < datosHoja.length; index++) {
        const element = datosHoja[index];
        if (index == 0) {
          worksheet.addRow({ lote: element.loteId, pesolote: this.pesoLoteIndividual(element.loteId), cantidad: +element.cantidad, pesoUnitario: +element.pesoUnitario, peso: element.pesoUnitario * element.cantidad, descripcion: element.descripcion, categoria: element.categoria, destinatario1: configSpreadSheet.destinatario1, destinatario2: configSpreadSheet.destinatario2, destinatario3: destinatario3, observaciones: element.observaciones });
        }
        else {
          worksheet.addRow({ cantidad: +element.cantidad, pesoUnitario: +element.pesoUnitario, peso: element.pesoUnitario * element.cantidad, descripcion: element.descripcion, categoria: element.categoria, observaciones: element.observaciones });
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

  pesoLoteIndividual(loteId: number): number {
    let peso = 0;
    const arrObj = this.lotesJsonStrToObjArray();
    if (LotesStorage.getItem() != null) {
      arrObj.forEach(element => {
        if (element.loteId == loteId) {
          peso += element.pesoUnitario * element.cantidad;
        }
      });
    }
    return peso;
  }


  pesoLotes(): number {
    let peso = 0;
    const arrObj = this.lotesJsonStrToObjArray();
    if (LotesStorage.getItem() != null) {
      arrObj.forEach(element => {
        peso += element.pesoUnitario * element.cantidad;
      });
    }
    return peso;
  }

  addIssue(issue: Issue): void {
    let maxId = 0;
    const arrObj = this.lotesJsonStrToObjArray();
    if (LotesStorage.getItem() != null) {
      maxId = Math.max(...arrObj.map(o => o.id));
    }

    issue.id = maxId + 1;
    arrObj.push(issue);
    this.persistArray(arrObj);
  }

  updateIssue(issue: Issue): void {
    let arrObj = this.lotesJsonStrToObjArray();

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
    let arrObj = this.lotesJsonStrToObjArray();
    const filtObj = arrObj.filter(obj => obj.id !== id);
    this.persistArray(filtObj);
  }

  deleteAll() {
    LotesStorage.removeItem();
  }

  persistArray(arrObj) {
    const strObj = JSON.stringify(arrObj);
    LotesStorage.setItem(strObj);
  }

}

var LotesStorage = {

  getItem: function () {
    return localStorage.getItem("LotesValues");
  },

  setItem: function (value) {
    localStorage.setItem("LotesValues", value);
  },

  removeItem: function () {
    return localStorage.removeItem("LotesValues");
  }

}