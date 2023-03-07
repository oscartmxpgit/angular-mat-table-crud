import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CajaBoxesComponent } from './caja-boxes/caja-boxes.component';
import { HomeComponent } from './home/home.component';
import { TableContentComponent } from './table-content/table-content.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'cajaBoxes',component:CajaBoxesComponent},
  {path:'tablecaja',component:TableContentComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
