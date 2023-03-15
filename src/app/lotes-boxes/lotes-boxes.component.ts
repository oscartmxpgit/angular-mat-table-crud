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
  constructor(private router: Router, public dialog: MatDialog, public dataService: DataService, public httpClient: HttpClient, public lotesDataService: LotesDataService) { }
  obs: any = [];
  panelOpenState = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  maxLote = 0;
  lotesDatabase: DataService | null;

  ngOnInit() {
    this.maxLote = this.lotesDataService.getNumLotes();

    for (let index = 0; index < this.maxLote; index++) {
      this.tabs.push('Lote ' + (index + 1))
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
    const dialogRef = this.dialog.open(LoteInfoComponent, {
      data: { loteId: this.maxLote + 1 }, width: '45%', panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.maxLote += 1;
        this.tabs.push('Lote ' + (this.maxLote));
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
