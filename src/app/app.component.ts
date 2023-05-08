import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactDialogComponent } from './dialogs/contact-dialog/contact-dialog.component';
import { CajasDataService } from './services/cajas-data.service';
import { DataService } from './services/data.service';
import { LotesDataService } from './services/lotes-data.service';
import { HttpClient } from '@angular/common/http';
import { configSpreadSheet } from 'assets/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  jsonConfigData: any;

  ngOnInit(): void {
    this.http.get(configSpreadSheet.jsonUrl).subscribe(
      (response) => { this.jsonConfigData = response; },
      (error) => { console.log(error); });
  }

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    public dataService: DataService) {
  }

  contact() {
    const dialogRef = this.dialog.open(ContactDialogComponent, {
      data: { }, width: '85%', panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.res === 'Ok') {
        this._snackBar.open('Mensaje enviado correctamente', 'Cerrar');
      }
    });
  }

}