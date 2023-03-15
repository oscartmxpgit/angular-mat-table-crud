import { Injectable } from '@angular/core';
import { Caja } from 'app/models/issue';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CajasDataService {
  dataChange: BehaviorSubject<Caja[]> = new BehaviorSubject<Caja[]>([]);

  constructor() { }


  get data(): Caja[] {
    return this.dataChange.value;
  }

  cajasJsonStrToObjArray(): Caja[] {
    const cajData = CajasDataStorage.getItem();
    var obj = eval(cajData);
    var res = [];
    for (var i in obj)
      res.push(obj[i]);

    return res;
  }

  addCaja(caja: Caja): void {
    const arrObj = this.cajasJsonStrToObjArray();

    arrObj.push(caja);
    this.persistArray(arrObj);
  }

  cajasLoteUsr(currentLote: number): Caja[] {
    const arrObj = this.cajasJsonStrToObjArray().filter(caja=>caja.loteId==currentLote);
    let cajasTotal:Caja[] =[];
    arrObj.forEach(element => {
      cajasTotal.push(element);
    });
    return cajasTotal;
  }

  getCajasData(): void {
    const arrObj = this.cajasJsonStrToObjArray();
    this.dataChange.next(arrObj);
  }


  deleteAll() {
    CajasDataStorage.removeItem();
  }

  deleteItem(loteId: number, cajaId: string) {
    let arrObj = this.cajasJsonStrToObjArray();
    //const filtObj = arrObj.filter(obj => {obj.loteId !== loteId && obj.cajaId !== cajaId});
    let filtObj = arrObj.filter(function (currentElement) {
      return currentElement.loteId !== loteId && currentElement.cajaId !== cajaId;
    });
    this.persistArray(filtObj);
  }

  persistArray(arrObj) {
    const strObj = JSON.stringify(arrObj);
    CajasDataStorage.setItem(strObj);
  }
}



var CajasDataStorage = {

  getItem: function () {
    return localStorage.getItem("CajasDataValues");
  },

  setItem: function (value) {
    localStorage.setItem("CajasDataValues", value);
  },

  removeItem: function () {
    return localStorage.removeItem("CajasDataValues");
  }

}