import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../services/data.service';
import { AddDialogComponent } from '../dialogs/add/add.dialog.component';
import { Issue } from '../models/issue';
import { DeleteDialogComponent } from '../dialogs/delete/delete.dialog.component';
import { EditDialogComponent } from '../dialogs/edit/edit.dialog.component';
import { DatosUsuarioComponent } from 'app/dialogs/datos-usuario/datos-usuario.component';
import { PesosCajasComponent } from 'app/dialogs/pesos-cajas/pesos-cajas.component';
import { LotesDataService } from 'app/services/lotes-data.service';
import { CajasDataService } from 'app/services/cajas-data.service';
import { EditLoteInfoDialogComponent } from 'app/dialogs/edit-lote-info-dialog/edit-lote-info-dialog.component';
import { GsheetsExportService } from 'app/services/gsheets-export.service';

@Component({
  selector: 'app-table-content',
  templateUrl: './table-content.component.html',
  styleUrls: ['./table-content.component.css']
})
export class TableContentComponent implements OnInit {
  displayedColumns = ['cajaId', 'cantidad', 'pesoUnitario', 'peso', 'descripcion', 'categoria', 'actions'];
  lotesDatabase: DataService | null;
  dataSource: CajasDataSource | null;
  index: number;
  loteId: number;

  private _indiceLoteSel: string;

  @Input() set indiceLoteSel(value: string) {
    this._indiceLoteSel = value;
    this.loadData();
  }

  get indiceLoteSel(): string {
    return this._indiceLoteSel;
  }

  constructor(public httpClient: HttpClient,
    public dialog: MatDialog,
    private translate: TranslateService,
    public gsheetsExportService: GsheetsExportService,
    public lotesDataService: LotesDataService,
    public cajasDataService: CajasDataService,
    public dataService: DataService) {
    this.translate.setDefaultLang('es');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|es/) ? browserLang : 'en');
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild('TABLE') table: ElementRef;

  getRemitenteLote(): string {
    return this.lotesDataService.getRemitente(+this.indiceLoteSel);
  }

  editLote() {
    const dialogRef = this.dialog.open(EditLoteInfoDialogComponent, {
      data: {loteId: this.indiceLoteSel, remitente: this.getRemitenteLote()}, width: '85%', panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.lotesDatabase.dataChange.value.findIndex(x => x.loteId === this.loteId);
        // Then you update that record using data from dialogData (values you enetered)
        this.lotesDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
        this.loadData();
        this.refreshTable();
      }
    });
  }

  ExportTOExcel() {
    const dialogRef = this.dialog.open(DatosUsuarioComponent, {
      data: { currentLote: this.indiceLoteSel }, width: '85%', panelClass: 'custom-dialog-container'
    });
  }

  PesosCajas() {
    const dialogRef = this.dialog.open(PesosCajasComponent, {
      data: { currentLote: this.indiceLoteSel }, width: '95%', panelClass: 'custom-dialog-container'
    });
  }

  deleteLote() {
    if (confirm("¿Seguro que desea eliminar todo el lote?")) {
      this.dataService.deleteLote(this.indiceLoteSel);
      this.lotesDataService.deleteItem(this.indiceLoteSel);
      this.cajasDataService.deleteCajasLote(+this.indiceLoteSel);
      window.location.reload();
    }

  }
  sendLotes() {
    if (confirm("¿Seguro que desea enviar todos los lotes?")) {
      this.gsheetsExportService.exportToSheets();

    }
  }

  maxLote: any;
  ngOnInit() {
    this.maxLote = this.lotesDataService.getNumLotes();
  }

  addNew() {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      data: { loteId: this.indiceLoteSel, issue: Issue }, width: '95%', panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        this.lotesDatabase.dataChange.value.push(this.dataService.getDialogData());
        this.loadData();
        this.refreshTable();
      }
    });
  }

  startEdit(i: number, id: number, loteId: number, cajaId: number, descripcion: string, categoria: string, pesoUnitario: number, cantidad: number, observaciones: string) {
    this.loteId = loteId;
    // index row is used just for debugging proposes and can be removed
    this.index = i;
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {
        id: id, loteId: loteId, cajaId: cajaId, descripcion: descripcion, categoria: categoria, pesoUnitario: pesoUnitario, cantidad: cantidad, observaciones: observaciones,
      }, width: '95%', panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.lotesDatabase.dataChange.value.findIndex(x => x.loteId === this.loteId);
        // Then you update that record using data from dialogData (values you enetered)
        this.lotesDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
        this.loadData();
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, id: number, loteId: number, cajaId: number, descripcion: string, cantidad: number, pesoUnitario: number, categoria: string) {
    this.index = i;
    this.loteId = loteId;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { id: id, loteId: loteId, cajaId: cajaId, descripcion: descripcion, cantidad: cantidad, pesoUnitario: pesoUnitario, categoria: categoria }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {/*
        const foundIndex = this.lotesDatabase.dataChange.value.findIndex(x => x.loteId === this.loteId);
        // for delete we use splice in order to remove single object from DataService
        this.lotesDatabase.dataChange.value.splice(foundIndex, 1); */
        this.loadData();
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
    this.lotesDatabase = new DataService(this.httpClient, this.lotesDataService);
    this.dataSource = new CajasDataSource(this.lotesDatabase, this.paginator, this.sort, this.indiceLoteSel);
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

  constructor(public _lotesDatabase: DataService,
    public _paginator: MatPaginator,
    public _sort: MatSort,
    public indiceLoteSel: string
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Issue[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._lotesDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page,
    ];

    this._lotesDatabase.getIssuesPorLote(this.indiceLoteSel);

    return merge(...displayDataChanges).pipe(map(() => {
      // Filter data
      this.filteredData = this._lotesDatabase.data.slice().filter((issue: Issue) => {
        const searchStr = (issue.loteId + issue.descripcion + issue.categoria).toLowerCase();
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
        case 'loteId': [propertyA, propertyB] = [a.loteId, b.loteId]; break;
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