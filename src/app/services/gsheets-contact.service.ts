import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GsheetsContactService {

  baseURL = "https://script.google.com/macros/s/AKfycbz-L8nE3q_FXLLeylPD078son9vXq-A92rdvZCWTDaYB_aRV-yf8gBo_SYL-lZOABxl9Q/exec";
  resourcesSpreadsheetId = "1ltbkxz2-ED91BSpY13WbFgUokf2lYncy42CoJ3v6Zxo";

  constructor(private http: HttpClient) { }

  exportToSheets(data) {
    this.post(data);
  }

  post(data: any): any {
    const baseUrl = this.baseURL;  // Please set your Web Apps URL.
    const para = {
      spreadsheetId: this.resourcesSpreadsheetId,  // Please set your Google Spreadsheet ID.
      sheetName: "MisContactos",  // Please set the sheet name you want to retrieve the values.
      values: data,  // Please set the sheet name you want to retrieve the values.
    };
    const q = new URLSearchParams(para);
    const url = baseUrl + "?" + q;

    return this.http.post(url, data).subscribe();
  }

}
