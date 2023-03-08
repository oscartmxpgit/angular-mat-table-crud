import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../services/data.service';
import { AddDialogComponent } from '../dialogs/add/add.dialog.component';
import { Issue } from '../models/issue';
import { DeleteDialogComponent } from '../dialogs/delete/delete.dialog.component';
import { EditDialogComponent } from '../dialogs/edit/edit.dialog.component';

@Component({
  selector: 'app-table-content',
  templateUrl: './table-content.component.html',
  styleUrls: ['./table-content.component.css']
})
export class TableContentComponent implements OnInit {
  displayedColumns = ['cajaId', 'descripcion', 'categoria', 'pesoUnitario', 'cantidad', 'peso', 'actions'];
  cajasDatabase: DataService | null;
  dataSource: CajasDataSource | null;
  index: number;
  cajaId: number;

  private _indiceCajaSel: string;

  @Input() set indiceCajaSel(value: string) {
    this._indiceCajaSel = value + 1;
    this.loadData();
  }

  get indiceCajaSel(): string {
    return this._indiceCajaSel;
  }

  constructor(public httpClient: HttpClient,
    public dialog: MatDialog,
    private translate: TranslateService,
    public dataService: DataService) {
    this.translate.setDefaultLang('es');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|es/) ? browserLang : 'en');
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild('TABLE') table: ElementRef;

  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Caja');

    /* save to file */
    XLSX.writeFile(wb, 'MisCajas.xlsx');

  }

  saveData(){
    CajasStorage.setItem("hola");
  }

  maxCaja : any;
  ngOnInit() {
    this.dataService.getNumCajas();
    this.maxCaja = this.dataService.numCajas;
  }

  addNew() {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      data: { cajaId: this.indiceCajaSel, issue: Issue }, width: '85%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        this.cajasDatabase.dataChange.value.push(this.dataService.getDialogData());
        this.refreshTable();
      }
    });
  }

  startEdit(i: number, cajaId: number, descripcion: string, categoria: string, pesoUnitario: number, cantidad: number) {
    this.cajaId = cajaId;
    // index row is used just for debugging proposes and can be removed
    this.index = i;
    console.log(this.index);
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {
        cajaId: cajaId, descripcion: descripcion, categoria: categoria, pesoUnitario: pesoUnitario, cantidad: cantidad,
      }, width: '85%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.cajasDatabase.dataChange.value.findIndex(x => x.cajaId === this.cajaId);
        // Then you update that record using data from dialogData (values you enetered)
        this.cajasDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, cajaId: number, descripcion: string, cantidad: number, pesoUnitario: number, categoria: string) {
    this.index = i;
    this.cajaId = cajaId;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { cajaId: cajaId, descripcion: descripcion, cantidad: cantidad, pesoUnitario: pesoUnitario, categoria: categoria }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.cajasDatabase.dataChange.value.findIndex(x => x.cajaId === this.cajaId);
        // for delete we use splice in order to remove single object from DataService
        this.cajasDatabase.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }

  private refreshTable() {
    // Refreshing table using paginator
    // Thanks yeager-j for tips
    // https://github.com/marinantonio/angular-mat-table-crud/issues/12
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  public loadData() {
    this.cajasDatabase = new DataService(this.httpClient);
    this.dataSource = new CajasDataSource(this.cajasDatabase, this.paginator, this.sort, this.indiceCajaSel);
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
}

export class CajasDataSource extends DataSource<Issue> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Issue[] = [];
  renderedData: Issue[] = [];

  constructor(public _cajasDatabase: DataService,
    public _paginator: MatPaginator,
    public _sort: MatSort,
    public indiceCajaSel: string
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Issue[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._cajasDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page,
    ];

    this._cajasDatabase.getIssuesPorCaja(this.indiceCajaSel);

    return merge(...displayDataChanges).pipe(map(() => {
      // Filter data
      this.filteredData = this._cajasDatabase.data.slice().filter((issue: Issue) => {
        const searchStr = (issue.cajaId + issue.descripcion + issue.categoria).toLowerCase();
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
  sortData(data: Issue[]): Issue[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'cajaId': [propertyA, propertyB] = [a.cajaId, b.cajaId]; break;
        case 'descripcion': [propertyA, propertyB] = [a.descripcion, b.descripcion]; break;
        case 'categoria': [propertyA, propertyB] = [a.categoria, b.categoria]; break;
        case 'pesoUnitario': [propertyA, propertyB] = [a.pesoUnitario, b.pesoUnitario]; break;
        case 'cantidad': [propertyA, propertyB] = [a.cantidad, b.cantidad]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}

var CajasStorage = {

  getItem: function (key) {
    return localStorage.getItem("CajasValues");
  },

  setItem: function (value) {
    localStorage.setItem("CajasValues", value);
  },

  removeItem: function (key) {
    return localStorage.removeItem("CajasValues");
  }

}