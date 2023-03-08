import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Issue } from '../models/issue';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class DataService {
  //private readonly API_URL = 'https://api.github.com/repos/angular/angular/issues';
  private readonly API_URL = './assets/datosEjemplo.json';
  private readonly API_URdatosComboBoxes = './assets/datosComboBoxes.json';

  dataChange: BehaviorSubject<Issue[]> = new BehaviorSubject<Issue[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  cajasData: any;
  numCajas: number;

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

  getNumCajas(): any {
    const data = CajasStorage.getItem();

    this.httpClient.get<Issue[]>(this.API_URL).subscribe(data => {
      this.numCajas = Math.max(...data.map(o => o.cajaId));
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }


  /** CRUD METHODS */
  getIssuesPorCaja(indiceCajaSel: string): void {
    this.httpClient.get<Issue[]>(this.API_URL).subscribe(data => {
      this.dataChange.next(data.filter(caja => caja.cajaId === +indiceCajaSel)
      );
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  getAllIssues(): void {
    this.httpClient.get<Issue[]>(this.API_URL).subscribe(data => {
      this.dataChange.next(data);
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  // DEMO ONLY, you can find working methods below
  addIssue(issue: Issue): void {
    this.dialogData = issue;
  }

  updateIssue(issue: Issue): void {
    this.dialogData = issue;
  }

  deleteIssue(id: number): void {
    console.log(id);
  }

}

var CajasStorage = {

  getItem: function () {
    return localStorage.getItem("CajasValues");
  },

  setItem: function (value) {
    localStorage.setItem("CajasValues", value);
  },

  removeItem: function (key) {
    return localStorage.removeItem("CajasValues");
  }

}