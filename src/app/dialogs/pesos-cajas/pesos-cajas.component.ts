import { DataSource } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { comboData } from 'app/models/datosComboBoxes';
import { Caja } from 'app/models/issue';
import { CajasDataService } from 'app/services/cajas-data.service';
import { DataService } from 'app/services/data.service';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-pesos-cajas',
  templateUrl: './pesos-cajas.component.html',
  styleUrls: ['./pesos-cajas.component.css']
})
export class PesosCajasComponent implements OnInit {
  cajasDatabase: CajasDataService | null;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild('TABLE') table: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public httpClient: HttpClient, public cajasDataService: CajasDataService, public dialogRef: MatDialogRef<PesosCajasComponent>,) { }
  ngOnInit(): void {
    this.loadData();
  }

  public loadData() {
    this.cajasDatabase = new CajasDataService();

    this.dataSource = new CajasDatosSource(this.cajasDatabase, this.paginator, this.sort);
    fromEvent(this.filter.nativeElement, 'keyup')
      // .debounceTime(150)
      // .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Campo requerido' :
      this.formControl.hasError('email') ? 'Correo electrónico no válido' :
        '';
  }

  submit() {
    // empty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmPesos(): void {
    this.cajasDataService.establecerCajas(this.data);
  }

  displayedColumns = ['loteId', 'cajaId', 'peso', 'observaciones'];
  dataSource: CajasDatosSource | null;

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}

export class CajasDatosSource extends DataSource<Caja> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Caja[] = [];
  renderedData: Caja[] = [];

  constructor(public _lotesDatabase: CajasDataService,
    public _paginator: MatPaginator,
    public _sort: MatSort,
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Caja[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._lotesDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page,
    ];

    this._lotesDatabase.cajasJsonStrToObjArray();

    return merge(...displayDataChanges).pipe(map(() => {
      // Filter data
      this.filteredData = this._lotesDatabase.data.slice().filter((issue: Caja) => {
        const searchStr = (issue.loteId + issue.cajaId + issue.peso + issue.observaciones).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });

      // Sort filtered data
      const sortedData = this.sortData(this.filteredData.slice());

      // Grab the page's slice of the filtered sorted data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
      return this.renderedData;
    }
    ));
  }

  disconnect() { }


  /** Returns a sorted copy of the database data. */
  sortData(data: Caja[]): Caja[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'loteId': [propertyA, propertyB] = [a.loteId, b.loteId]; break;
        case 'cajaId': [propertyA, propertyB] = [a.cajaId, b.cajaId]; break;
        case 'peso': [propertyA, propertyB] = [a.peso, b.peso]; break;
        case 'observaciones': [propertyA, propertyB] = [a.observaciones, b.observaciones]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
  }