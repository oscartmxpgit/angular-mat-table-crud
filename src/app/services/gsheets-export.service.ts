import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Caja, Issue, Lote } from 'app/models/issue';

@Injectable({
  providedIn: 'root'
})
export class GsheetsExportService {

  private readonly ELEMENTS_KEY = "CajasValues";
  private readonly CAJAS_KEY = "CajasDataValues";
  private readonly LOTES_KEY = "LotesDataValues";

  private readonly LOTES_SHEET = "lotes";
  private readonly CAJAS_SHEET = "cajas";
  private readonly ELEMENTS_SHEET = "elements";
  private readonly now = new Date();

  baseURL = "https://script.google.com/macros/s/AKfycbxas_3d7LHr1NG-x45xiPU5xpc20TrhDoqQprV-U8QYErufwFC2RgiQHRkoSsu-cJHf1g/exec";
  resourcesSpreadsheetId = "1J5kz8b6cAsaICl3w-_zTGZYhdjIhlfn0fEE_rYrPD7E";

  constructor(private http: HttpClient) { }

  exportToSheets() {
    this.exportLotes();
  }

  exportLotes() {
    const lotes = this.getLotesData();
    lotes.forEach(lote => {
      this.post(this.now + " " + lote.loteId + lote.remitente, this.LOTES_SHEET);
    });
  }

  exportCajas() {
    const cajas = this.getCajasData();
  }

  exportElements() {
    const issues = this.getElementsData();
  }

  post(data: any, sheetName: string): any {
    const baseUrl = this.baseURL;  // Please set your Web Apps URL.
    const para = {
      spreadsheetId: this.resourcesSpreadsheetId,  // Please set your Google Spreadsheet ID.
      sheetName: sheetName,  // Please set the sheet name you want to retrieve the values.
      values: data,  // Please set the sheet name you want to retrieve the values.
    };
    const q = new URLSearchParams(para);
    const url = baseUrl + "?" + q;

    return this.http.post(url, data).subscribe();
  }

  getElementsData(): Issue[] {
    return this.cajasJsonStrToObjArray(this.ELEMENTS_KEY);
  }

  getCajasData(): Caja[] {
    return this.cajasJsonStrToObjArray(this.CAJAS_KEY);
  }

  getLotesData(): Lote[] {
    return this.cajasJsonStrToObjArray(this.LOTES_KEY);
  }

  cajasJsonStrToObjArray(key): any[] {
    const cajData = LotesCajasStorage.getItem(key);
    var obj = eval(cajData);
    var res = [];
    for (var i in obj)
      res.push(obj[i]);

    return res;
  }
}

var LotesCajasStorage = {
  getItem: function (key) {
    return localStorage.getItem(key);
  }
}