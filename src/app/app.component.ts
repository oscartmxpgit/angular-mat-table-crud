import { Component, OnInit } from '@angular/core';
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
    public dataService: DataService) {
  }

  DeleteAll() {
    if(confirm("¿Seguro que desea eliminar todo?")) {
      this.dataService.deleteAll();
      window.location.reload();
    }
  }

}