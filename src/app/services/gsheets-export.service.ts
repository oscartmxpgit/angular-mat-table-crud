import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Caja, Issue, IssueCompleto, Lote } from 'app/models/issue';

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

  baseURL = "https://script.google.com/macros/s/AKfycbz-L8nE3q_FXLLeylPD078son9vXq-A92rdvZCWTDaYB_aRV-yf8gBo_SYL-lZOABxl9Q/exec";

  resourcesSpreadsheetId = "1e8UOVKbTfWsmaskudKpEU1u0rMDVu_YPWOuxcMqKweI";

  constructor(private http: HttpClient) { }

  exportToSheets(palet, destinatario) {
    let issuesCompletos = this.conformData();
    let aPostear = "";
    issuesCompletos.forEach(element => {
      aPostear += element.fecha + ",";
      aPostear += palet + ",";
      aPostear += element.loteId + ",";
      aPostear += element.cajaId + ",";
      aPostear += element.pesoCaja + ",";
      aPostear += element.cantidad + ",";
      aPostear += element.pesoUnitario + ",";
      aPostear += element.descripcion + ",";
      aPostear += element.categoria + ",";
      aPostear += destinatario + ",";
      aPostear += element.observaciones + ",";
      aPostear += element.remitente + ",";
      this.post(aPostear.slice(0, -1));
    });
  }

  conformData(): IssueCompleto[] {
    const issues = this.getElementsData();
    let issueCompleto: IssueCompleto = new IssueCompleto();
    let issuesCompletos: IssueCompleto[] = [];
    issues.forEach(issue => {
      issueCompleto.fecha = this.now.toISOString();
      issueCompleto.loteId = issue.loteId;
      issueCompleto.cajaId = issue.cajaId;
      issueCompleto.pesoCaja = this.getPesoCaja(issue.loteId, issue.cajaId);
      issueCompleto.cantidad = issue.cantidad;
      issueCompleto.pesoUnitario = issue.pesoUnitario;
      issueCompleto.descripcion = issue.descripcion;
      issueCompleto.categoria = issue.categoria;
      if (issue.observaciones != undefined) {
        issueCompleto.observaciones = issue.observaciones;
      }
      else {
        issueCompleto.observaciones = "-";
      }
      issueCompleto.remitente = this.getRemitente(issue.loteId);
      issuesCompletos.push(issueCompleto);
    });
    return issuesCompletos;
  }

  getRemitente(loteid): string {
    const lotes = this.getLotesData();
    let remitente = "";
    lotes.forEach(lote => {
      console.log(lote)
      if (lote.loteId == loteid) {
        remitente = lote.remitente;
      }
    });
    return remitente;
  }

  getPesoCaja(loteid, cajaId): number {
    const cajas = this.getCajasData();
    let pesoCaja=0;
    cajas.forEach(caja => {
      if (caja.loteId == loteid && caja.cajaId == cajaId) {
        pesoCaja = caja.peso;
      }
    });
    return pesoCaja;
  }

  post(data: any): any {
    const baseUrl = this.baseURL;  // Please set your Web Apps URL.
    const para = {
      spreadsheetId: this.resourcesSpreadsheetId,  // Please set your Google Spreadsheet ID.
      sheetName: "MisLotes",  // Please set the sheet name you want to retrieve the values.
      values: data,  // Please set the sheet name you want to retrieve the values.
    };
    const q = new URLSearchParams(para);
    const url = baseUrl + "?" + q;

    return this.http.post(url, data).subscribe();
  }

  postB(data: any): any {
    const baseUrl = this.baseURL;  // Please set your Web Apps URL.
    const para = {
      spreadsheetId: this.resourcesSpreadsheetId,  // Please set your Google Spreadsheet ID.
      sheetName: 'MisLotes',  // Please set the sheet name you want to retrieve the values.
      fechaH: data.fecha,
      loteId: data.LoteId,
      cajaId: data.CajaId,
      pesCaj: data.pesoCaja,
      cantid: data.cantidad,
      pesoUn: data.pesoUnitario,
      descri: data.descripcion,
      catego: data.categoria,
      destin: data.destinatario,
      observ: data.observaciones,
      remite: data.remitente,
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