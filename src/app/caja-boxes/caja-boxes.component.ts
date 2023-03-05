import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-caja-boxes',
  templateUrl: './caja-boxes.component.html',
  styleUrls: ['./caja-boxes.component.scss']
})
export class CajaBoxesComponent implements OnInit {
  constructor(private router: Router) {}

  obs: any = [];

  displayedColumns: string[] = ['caja_id', 'cantidad_elementos', 'star'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  abrirCaja(){
    this.router.navigateByUrl('/tablecaja');
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

export interface PeriodicElement {
  caja_id: string;
  cantidad_elementos: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { caja_id: '1', cantidad_elementos: '23' },
  { caja_id: '2', cantidad_elementos: '53' },
];
