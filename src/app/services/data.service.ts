import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Caja, Issue } from '../models/issue';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as FileSaver from 'file-saver';
import { configSpreadSheet } from 'assets/config';
import { LotesDataService } from './lotes-data.service';

@Injectable()
export class DataService {
  //private readonly API_URL = 'https://api.github.com/repos/angular/angular/issues';
  private readonly API_URdatosComboBoxes = './assets/datosComboBoxes.json';

  dataChange: BehaviorSubject<Issue[]> = new BehaviorSubject<Issue[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  cajasData: any;
  numLotes: number;
  numCajas: number;
  jsonConfigData: any;

  constructor(private httpClient: HttpClient, public lotesDataService: LotesDataService) {
    this.httpClient.get(configSpreadSheet.jsonUrl).subscribe(
      (response) => { this.jsonConfigData = response; },
      (error) => { console.log(error); });
   }

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
      this.numCajas = 0;
    }
    else {
      const arrObj = this.cajasJsonStrToObjArray();
      if (arrObj.length > 0) {
        this.numCajas = arrObj.length;
      }
      else {
        this.numCajas = 0;
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
  getIssuesPorLote(indiceLoteSel: string): void {
    const arrObj = this.cajasJsonStrToObjArray();
    this.dataChange.next(arrObj.filter(caja => caja.loteId === +indiceLoteSel));
  }

  getCantCajasPorLote(indiceLoteSel: string): number {
    const arrObj = this.cajasJsonStrToObjArray();
    return arrObj.filter(caja => caja.loteId === +indiceLoteSel).length;
  }

  exportToExcel(currentLote, pesoLote, destinatario2, destinatario3, observacionesExcel): void {
    var options = {
      filename: 'MisCajas.xlsx',
      useStyles: true,
      useSharedStrings: true
    };

    let workbook = new Excel.Workbook(options);

    const arrObj = this.cajasJsonStrToObjArray();

    var worksheet = workbook.addWorksheet('Cajas', { properties: { tabColor: { argb: '000000' } } });

    const now = new Date();
    /*TITLE*/
    worksheet.mergeCells('A1', 'C1');
    worksheet.mergeCells('A2', 'C2');
    worksheet.mergeCells('A3', 'C3');
    worksheet.mergeCells('A4', 'C4');
    worksheet.mergeCells('A5', 'C5');
    worksheet.mergeCells('A6', 'C6');
    worksheet.mergeCells('A7', 'C7');

    worksheet.mergeCells('D1', 'F1');
    worksheet.mergeCells('D2', 'F2');
    worksheet.mergeCells('D3', 'F3');
    worksheet.mergeCells('D5', 'F5');
    worksheet.mergeCells('D6', 'F6');

    worksheet.getCell('A1').value = 'Operación:';
    worksheet.getCell('A2').value = 'Fecha de generación de Excel:';
    worksheet.getCell('A3').value = 'Nombre del lote:';
    worksheet.getCell('A4').value = 'Peso total (usuario):';
    worksheet.getCell('A5').value = 'Destinatario3:';
    worksheet.getCell('A6').value = 'Observaciones lote:';
    worksheet.getCell('A7').value = 'Pallet nº:';

    worksheet.getCell('D1').value = this.jsonConfigData[0].operacionNombreCompleto;
    worksheet.getCell('D2').value = now.toISOString();
    worksheet.getCell('D3').value = this.lotesDataService.getRemitente(currentLote);
    worksheet.getCell('D4').value = +pesoLote;
    worksheet.getCell('D5').value = destinatario3;
    worksheet.getCell('D6').value = observacionesExcel;

    worksheet.getCell('D4').alignment = { vertical: 'center', horizontal: 'left' };
    worksheet.getCell('D7').alignment = { vertical: 'center', horizontal: 'left' };

    /*Column headers*/
    worksheet.getRow(9).values = ['CAJA Nº', 'PESO CAJA (Kgs)', 'CANTIDAD', 'PESO UNITARIO (Kgs)', 'PESO (Kgs)', 'DESCRIPCIÓN', 'CATEGORÍA', 'DESTINATARIO 1', 'DESTINATARIO 2', 'DESTINATARIO 3', 'OBSERVACIONES'];

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

    ['A9', 'B9', 'C9', 'D9', 'E9', 'F9', 'G9', 'H9', 'I9', 'J9', 'K9'].map(key => {
      worksheet.getCell(key).style = { font: { name: 'Arial Black', color: { argb: '909090' } } };
    });

    //this.getNumLotes();
    this.getNumCajas();

    const datosFiltradosLote = arrObj.filter(lote => lote.loteId === currentLote);
    for (let j = 0; j < this.getCantCajasPorLote(currentLote); j++) {
      const element = datosFiltradosLote[j];
      const cajaIdElem = element.cajaId;
      let datoNuevaCaja = false;
      if (datosFiltradosLote[j - 1] != undefined) {
        const cajaIdElemAnt = datosFiltradosLote[j - 1].cajaId;
        if (cajaIdElem != cajaIdElemAnt) {
          datoNuevaCaja = true;
        }
      }
      if (j == 0 || datoNuevaCaja) {
        worksheet.addRow({ caja: cajaIdElem, pesocaja: this.pesoLoteIndividual(currentLote, element.cajaId), cantidad: +element.cantidad, pesoUnitario: +element.pesoUnitario, peso: element.pesoUnitario * element.cantidad, descripcion: element.descripcion, categoria: element.categoria, destinatario1: this.jsonConfigData[0].destinatario1, destinatario2: destinatario2, destinatario3: destinatario3, observaciones: element.observaciones });
      }
      else {
        worksheet.addRow({ cantidad: +element.cantidad, pesoUnitario: +element.pesoUnitario, peso: element.pesoUnitario * element.cantidad, descripcion: element.descripcion, categoria: element.categoria, observaciones: element.observaciones });
      }
      if (datosFiltradosLote[j + 1] != undefined) {
        const cajaIdElemSig = datosFiltradosLote[j + 1].cajaId;
        if (cajaIdElem != cajaIdElemSig) {
          worksheet.addRow();
        }
      }
    }

    let fileName = this.jsonConfigData[0].operacion + "_" + this.lotesDataService.getRemitente(currentLote).substring(0,10) + "_" + now.toISOString() + ".xlsx";
    const excelBuffer: any = workbook.xlsx.writeBuffer();
    workbook.xlsx.writeBuffer()
      .then(function (buffer) {
        // done buffering
        const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(data, fileName);
      });
  }

  pesoLoteIndividual(currentLote: number, cajaId: string): number {
    let peso = 0;
    const arrObj = this.cajasJsonStrToObjArray().filter(lote => lote.loteId == currentLote);
    if (CajasStorage.getItem() != null) {
      arrObj.forEach(element => {
        if (element.cajaId == cajaId) {
          peso += element.pesoUnitario * element.cantidad;
        }
      });
    }
    return peso;
  }


  pesoCajasCalculado(currentLote: number, cajaId: string): number {
    let pesoCaja = 0;
    const arrObj = this.cajasJsonStrToObjArray().filter(lote => lote.loteId == currentLote);
    if (CajasStorage.getItem() != null) {
      arrObj.forEach(element => {
        if (element.cajaId == cajaId) {
          pesoCaja += element.pesoUnitario * element.cantidad;
        }
      });
    }
    return pesoCaja;
  }

  cajasIntroducidas(currentLote: number): Caja[] {
    let cajas: Caja[] = [];
    const arrObj = this.cajasJsonStrToObjArray().filter(lote => lote.loteId == currentLote);
    if (CajasStorage.getItem() != null) {
      arrObj.forEach(element => {
        const caja = new Caja();
        caja.loteId = currentLote;
        caja.cajaId = element.cajaId;
        caja.peso = 0;
        caja.observaciones = "";

        const arrObjFiltLoteId = cajas.filter(c => c.loteId == caja.loteId);
        const arrObjFiltCajaId = arrObjFiltLoteId.filter(c => c.cajaId == caja.cajaId);

        if (arrObjFiltCajaId.length === 0) {
          cajas.push(caja);
        }
      });
    }
    return cajas;
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
    let arrObj = this.cajasJsonStrToObjArray();
    const filtObj = arrObj.filter(obj => obj.id !== id);
    this.persistArray(filtObj);
  }

  deleteAll() {
    CajasStorage.removeItem();
  }

  deleteLote(indiceLoteSel) {
    let arrObj = this.cajasJsonStrToObjArray();
    const filtObj = arrObj.filter(obj => obj.loteId !== indiceLoteSel);
    this.persistArray(filtObj);
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