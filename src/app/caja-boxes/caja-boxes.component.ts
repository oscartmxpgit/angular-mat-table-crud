import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ResetDialogComponent } from '../dialogs/reset-dialog/reset-dialog.component';

@Component({
  selector: 'app-caja-boxes',
  templateUrl: './caja-boxes.component.html',
  styleUrls: ['./caja-boxes.component.scss']
})
export class CajaBoxesComponent implements OnInit {
  constructor(private router: Router, public dialog: MatDialog) { }

  obs: any = [];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
  }

  refresh() {
    //this.loadData();
    const dialogRef = this.dialog.open(ResetDialogComponent, {
    })
  }

  tabs = ['Caja 1'];
  selected = new FormControl(0);
  currCajaId = 1;

  addTab() {
    this.currCajaId += 1;
    this.tabs.push('Caja ' + (this.currCajaId));
    this.selected.setValue(this.tabs.length - 1);
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }

  abrirCaja() {
    this.router.navigateByUrl('/tablecaja');
  }
}
