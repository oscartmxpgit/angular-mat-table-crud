import { Component, OnInit } from '@angular/core';
import { CajasDataService } from './services/cajas-data.service';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  ngOnInit(): void {
  }

  constructor(
    public dataService: DataService, public cajaDataSrv: CajasDataService) {
  }

  DeleteAll() {
    if(confirm("¿Seguro que desea eliminar todo?")) {
      this.dataService.deleteAll();
      this.cajaDataSrv.deleteAll();
      window.location.reload();
    }
  }

}