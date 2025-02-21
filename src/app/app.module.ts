import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import {DataService} from './services/data.service';
import {AddDialogComponent} from './dialogs/add/add.dialog.component';
import {EditDialogComponent} from './dialogs/edit/edit.dialog.component';
import {DeleteDialogComponent} from './dialogs/delete/delete.dialog.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { TableContentComponent } from './table-content/table-content.component';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { ResetDialogComponent } from './dialogs/reset-dialog/reset-dialog.component';
import { AppRoutingModule } from './app-routing.module';
import { LotesBoxesComponent } from './lotes-boxes/lotes-boxes.component';
import { environment } from 'environments/environment';
import { OnlyNumberDirective } from './directives/only-number.directive';
import { DatosUsuarioComponent } from './dialogs/datos-usuario/datos-usuario.component';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import { MatExpansionModule } from '@angular/material/expansion';
import { HelpTextsComponent } from './help-texts/help-texts.component';
import { PesosCajasComponent } from './dialogs/pesos-cajas/pesos-cajas.component';
import { LoteInfoComponent } from './dialogs/lote-info/lote-info.component';
import { EditLoteInfoDialogComponent } from './dialogs/edit-lote-info-dialog/edit-lote-info-dialog.component';
import { HomeComponent } from './home/home.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ContactDialogComponent } from './dialogs/contact-dialog/contact-dialog.component';
import { FormatTimePipe } from './pipes/format-time.pipe';

@NgModule({
    declarations: [
        AppComponent,
        AddDialogComponent,
        EditDialogComponent,
        DeleteDialogComponent,
        TableContentComponent,
        ResetDialogComponent,
        LotesBoxesComponent,
        OnlyNumberDirective,
        DatosUsuarioComponent,
        HelpTextsComponent,
        PesosCajasComponent,
        LoteInfoComponent,
        EditLoteInfoDialogComponent,
        HomeComponent,
        ContactDialogComponent,
        FormatTimePipe,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MatCardModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatDialogModule,
        FormsModule,
        MatButtonModule,
        MatExpansionModule,
        MatSnackBarModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatMenuModule,
        MatSortModule,
        MatTableModule,
        MatToolbarModule,
        MatPaginatorModule,
        MatTabsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
    ],
    providers: [
        DataService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
