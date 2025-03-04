import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { LoteInfoComponent } from 'app/dialogs/lote-info/lote-info.component';
import { CajasDataService } from 'app/services/cajas-data.service';
import { DataService } from 'app/services/data.service';
import { LotesDataService } from 'app/services/lotes-data.service';
import { TableContentComponent } from 'app/table-content/table-content.component';
import { ResetDialogComponent } from '../dialogs/reset-dialog/reset-dialog.component';

@Component({
  selector: 'app-lotes-boxes',
  templateUrl: './lotes-boxes.component.html',
  styleUrls: ['./lotes-boxes.component.scss']
})
export class LotesBoxesComponent implements OnInit {
  constructor(private router: Router, public dialog: MatDialog,
    public dataService: DataService,
    public cajaDataSrv: CajasDataService,
    public httpClient: HttpClient,
    public lotesDataService: LotesDataService) { }
  obs: any = [];
  panelOpenState = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  lotesDatabase: DataService | null;

  ngOnInit() {
    const arrObj = this.lotesDataService.lotesJsonStrToObjArray();
    arrObj.forEach(element => {
      this.tabs.push(element.loteId)
    });
  }

  DeleteAll() {
    if(confirm("¿Seguro que desea eliminar todo?")) {
      this.dataService.deleteAll();
      this.cajaDataSrv.deleteAll();
      this.lotesDataService.deleteAll();
      window.location.reload();
    }
  }

  refresh() {
    //this.loadData();
    if (confirm("¿Estás seguro de eliminar todos los elementos? ")) {
      window.location.reload();
    }

  }

  tabs = [];
  selected = new FormControl(0);

  addTab() {
    const maxLote = this.lotesDataService.getNumLotes();
    const dialogRef = this.dialog.open(LoteInfoComponent, {
      data: { loteId: maxLote + 1 }, width: '85%', panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        window.location.reload();
      }
    });
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }

  abrirLote() {
    this.router.navigateByUrl('/tablelote');
  }
}
