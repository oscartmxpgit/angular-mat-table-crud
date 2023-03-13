import { Injectable } from '@angular/core';
import { Caja } from 'app/models/issue';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CajasDataService {
  dataChange: BehaviorSubject<Caja[]> = new BehaviorSubject<Caja[]>([]);

  constructor() { }

  establecerCajas(caja: Caja): void {

  }

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

  getCajasData(): void {
    const arrObj = this.cajasJsonStrToObjArray();
    this.dataChange.next(arrObj);
  }


  deleteAll() {
    CajasDataStorage.removeItem();
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