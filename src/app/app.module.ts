import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { API_KEY, GoogleSheetsDbService } from 'ng-google-sheets-db';

import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
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
import { CajaBoxesComponent } from './caja-boxes/caja-boxes.component';
import { HomeComponent } from './home/home.component';
import { environment } from 'environments/environment';
import { OnlyNumberDirective } from './directives/only-number.directive';

@NgModule({
    declarations: [
        AppComponent,
        AddDialogComponent,
        EditDialogComponent,
        DeleteDialogComponent,
        TableContentComponent,
        ResetDialogComponent,
        CajaBoxesComponent,
        HomeComponent,
        OnlyNumberDirective,
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
        DataService,
        {
            provide: API_KEY,
            useValue: environment.googleSheetsApiKey,
          },
          GoogleSheetsDbService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
