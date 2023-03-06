import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Issue} from '../models/issue';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

@Injectable()
export class DataService {
  //private readonly API_URL = 'https://api.github.com/repos/angular/angular/issues';
  private readonly API_URL = './assets/datosEjemplo.json';
  private readonly API_URdatosComboBoxes = './assets/datosComboBoxes.json';

  dataChange: BehaviorSubject<Issue[]> = new BehaviorSubject<Issue[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;

  constructor (private httpClient: HttpClient) {}

  getDatosComboBoxes(): any {
    this.httpClient.get<any>(this.API_URdatosComboBoxes).subscribe(data => {
        return data;
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  }


  get data(): Issue[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllIssues(indiceCajaSel: string): void {
    this.httpClient.get<Issue[]>(this.API_URL).subscribe(data => {
        this.dataChange.next(data.filter(caja=> caja.cajaId === +indiceCajaSel)
        );
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  }

  // DEMO ONLY, you can find working methods below
  addIssue (issue: Issue): void {
    this.dialogData = issue;
  }

  updateIssue (issue: Issue): void {
    this.dialogData = issue;
  }

  deleteIssue (id: number): void {
    console.log(id);
  }

  ///

  favorites = new Array();

  store(){
    console.log("store")
    this.favorites.push({code: "abc", description: "Australian broacasting corp."});
    this.favorites.push({code: "anz", description: "anz bank"});
    this.favorites.push({code: "cba", description: "cba bank"})

    var stringToStore = JSON.stringify(this.favorites);
    ProChartStorage.setItem("test.local.favorites", stringToStore);
  }

  get(){
    var fromStorage = ProChartStorage.getItem("test.local.favorites");
    var objectsFromStorage = JSON.parse(fromStorage)
    console.log(objectsFromStorage)
  }

  getById(valueToFind : string){
    var fromStorage = ProChartStorage.getItem("test.local.favorites");
    var objectsFromStorage = JSON.parse(fromStorage)
    console.log(objectsFromStorage);

    var toFind = objectsFromStorage.filter(function( obj ) {
      return obj.code == valueToFind;
    });

    console.log(toFind);
  }

  removeById(valueToFind){
    var fromStorage = ProChartStorage.getItem("test.local.favorites");
    var objectsFromStorage = JSON.parse(fromStorage)
    console.log(objectsFromStorage);

    var toFind = objectsFromStorage.filter(function( obj ) {
      return obj.code == valueToFind;
    });

    // find the index of the item to delete
    var index = objectsFromStorage.findIndex(x => x.code===valueToFind);

    if(index>=0){
      objectsFromStorage.splice(index, 1);
      var stringToStore = JSON.stringify(objectsFromStorage);
      ProChartStorage.setItem("test.local.favorites", stringToStore);
    }

  }

}

var ProChartStorage = {

  getItem: function (key) {
      return localStorage.getItem(key);
  },

  setItem: function (key, value) {
     console.log("prochart setItem")
     localStorage.setItem(key, value);
  },

  removeItem: function (key) {
      return localStorage.removeItem(key);
  },

  clear: function () {
      var keys = new Array();
      for (var i = 0, len = localStorage.length; i < len; i++) {
          var key = localStorage.key(i);
          if (key.indexOf("prochart") != -1 || key.indexOf("ProChart") != -1)
              keys.push(key);
      }
      for (var i = 0; i < keys.length; i++)
          localStorage.removeItem(keys[i]);
  }

}