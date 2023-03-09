import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DataService } from 'app/services/data.service';
import { TableContentComponent } from 'app/table-content/table-content.component';
import { ResetDialogComponent } from '../dialogs/reset-dialog/reset-dialog.component';

@Component({
  selector: 'app-caja-boxes',
  templateUrl: './caja-boxes.component.html',
  styleUrls: ['./caja-boxes.component.scss']
})
export class CajaBoxesComponent implements OnInit {
  constructor(private router: Router, public dialog: MatDialog, public dataService: DataService, public httpClient: HttpClient,) { }
  obs: any = [];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  maxCaja = 0;
  cajasDatabase: DataService | null;

  ngOnInit() {
    this.dataService.getNumCajas();
    this.maxCaja = this.dataService.numCajas;

    for (let index = 0; index < this.maxCaja; index++) {
      this.tabs.push('Caja ' + (index + 1))
    }
  }

  refresh() {
    //this.loadData();
    if(confirm("¿Estás seguro de eliminar todos los elementos? ")) {
      window.location.reload();
    }

  }

  tabs = [];
  selected = new FormControl(0);

  addTab() {
    this.maxCaja += 1;
    this.tabs.push('Caja ' + (this.maxCaja));
    this.selected.setValue(this.tabs.length - 1);
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }

  abrirCaja() {
    this.router.navigateByUrl('/tablecaja');
  }
}
