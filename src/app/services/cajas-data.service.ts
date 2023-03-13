import { Injectable } from '@angular/core';
import { Caja } from 'app/models/issue';
import { Observable } from 'rxjs/internal/Observable';
import { Of } from 'rxjs/observable/of';

@Injectable({
  providedIn: 'root'
})
export class CajasDataService {

  constructor() { }

  establecerCajas(caja: Caja): void {

  }

  getData(): Observable<Caja[]> {
    const cajData = CajasDataStorage.getItem();
    var obj = eval(cajData);
    var res = [];
    for (var i in obj)
      res.push(obj[i]);
    
      return Observable.of(res);

    return res;
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