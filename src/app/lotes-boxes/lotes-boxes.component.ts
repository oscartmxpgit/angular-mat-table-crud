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
  selector: 'app-lotes-boxes',
  templateUrl: './lotes-boxes.component.html',
  styleUrls: ['./lotes-boxes.component.scss']
})
export class LotesBoxesComponent implements OnInit {
  constructor(private router: Router, public dialog: MatDialog, public dataService: DataService, public httpClient: HttpClient,) { }
  obs: any = [];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  maxLote = 0;
  lotesDatabase: DataService | null;

  ngOnInit() {
    this.dataService.getNumLotes();
    this.maxLote = this.dataService.numLotes;

    for (let index = 0; index < this.maxLote; index++) {
      this.tabs.push('Lote ' + (index + 1))
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
    this.maxLote += 1;
    this.tabs.push('Lote ' + (this.maxLote));
    this.selected.setValue(this.tabs.length - 1);
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }

  abrirLote() {
    this.router.navigateByUrl('/tablelote');
  }
}
