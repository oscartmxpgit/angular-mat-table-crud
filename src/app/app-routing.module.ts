import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LotesBoxesComponent } from './lotes-boxes/lotes-boxes.component';
import { AvisosComponent } from './avisos/avisos.component';
import { TableContentComponent } from './table-content/table-content.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'home',component:HomeComponent},
  {path:'avisos',component:AvisosComponent},
  {path:'loteBoxes',component:LotesBoxesComponent},
  {path:'tablelote',component:TableContentComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
