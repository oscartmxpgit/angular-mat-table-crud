import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CajaBoxesComponent } from './caja-boxes/caja-boxes.component';
import { TableContentComponent } from './table-content/table-content.component';

const routes: Routes = [
  {path:'',component:CajaBoxesComponent},
  {path:'tablecaja',component:TableContentComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
