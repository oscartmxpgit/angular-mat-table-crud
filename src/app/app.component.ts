import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactDialogComponent } from './dialogs/contact-dialog/contact-dialog.component';
import { CajasDataService } from './services/cajas-data.service';
import { DataService } from './services/data.service';
import { LotesDataService } from './services/lotes-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  ngOnInit(): void {
  }

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    public dataService: DataService) {
  }

  contact() {
    const dialogRef = this.dialog.open(ContactDialogComponent, {
      data: { }, width: '85%', panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.destino === 'Ok') {
        this._snackBar.open('Mensaje enviado correctamente', 'Cerrar');
      }
    });
  }

}