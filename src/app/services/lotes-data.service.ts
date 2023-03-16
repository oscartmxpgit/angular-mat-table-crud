import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Lote, Issue } from '../models/issue';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as FileSaver from 'file-saver';
import { configSpreadSheet } from 'assets/config';

@Injectable({
  providedIn: 'root'
})
export class LotesDataService {

  dataChange: BehaviorSubject<Lote[]> = new BehaviorSubject<Lote[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  lotesData: any;
  numLotes: number;
  numCajas: number;

  constructor() { }

  get data(): Lote[] {
    return this.dataChange.value;
  }

  lotesJsonStrToObjArray(): Lote[] {
    const cajData = LotesDataStorage.getItem();
    var obj = eval(cajData);
    var res = [];
    for (var i in obj)
      res.push(obj[i]);

    return res;
  }

  getNumLotes(): number {
    let noLote = 0;
    if (LotesDataStorage.getItem() === null) {
      noLote = 0;
    }
    else {
      const arrObj = this.lotesJsonStrToObjArray();
      if (arrObj.length > 0) {
        noLote = Math.max(...arrObj.map(o => o.loteId));
      }
      else {
        noLote = 0;
      }
    }
    return noLote;
  }

  addLote(lote: Lote): void {
    const arrObj = this.lotesJsonStrToObjArray();

    arrObj.push(lote);
    this.persistArray(arrObj);
  }

  getRemitente(loteId: number): string {
    const arrObj = this.lotesJsonStrToObjArray().filter(lote=>lote.loteId==loteId);
    if (arrObj.length > 0) {
      this.numLotes = Math.max(...arrObj.map(o => o.loteId));
      return arrObj[0].remitente;
    }
    return "";
  }

  lotesLoteUsr(loteId: number): Lote[] {
    const arrObj = this.lotesJsonStrToObjArray().filter(lote=>lote.loteId==loteId);
    let lotesTotal:Lote[] =[];
    arrObj.forEach(element => {
      lotesTotal.push(element);
    });
    return lotesTotal;
  }

  updateLote(loteId: number, remitente: string) {
    const arrObj = this.lotesJsonStrToObjArray().filter(lote=>lote.loteId==loteId);
    arrObj.forEach(element => {
      element.remitente = remitente;
    });
    this.persistArray(arrObj);
  }

  getLotesData(): void {
    const arrObj = this.lotesJsonStrToObjArray();
    this.dataChange.next(arrObj);
  }

  deleteAll() {
    LotesDataStorage.removeItem();
  }

  deleteItem(loteId: string) {
    let arrObj = this.lotesJsonStrToObjArray();
    arrObj.forEach( (item, index) => {
      if(+item.loteId == +loteId){
        arrObj.splice(index,1);
      }
    });
    this.persistArray(arrObj);
  }

  persistArray(arrObj) {
    const strObj = JSON.stringify(arrObj);
    LotesDataStorage.setItem(strObj);
  }
}


var LotesDataStorage = {

  getItem: function () {
    return localStorage.getItem("LotesDataValues");
  },

  setItem: function (value) {
    localStorage.setItem("LotesDataValues", value);
  },

  removeItem: function () {
    return localStorage.removeItem("LotesDataValues");
  }

}