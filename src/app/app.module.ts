import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { ImportXlsxComponent } from './import-xlsx/import-xlsx.component';
import { DragDropDirective } from './import-xlsx/drag-drop.directive';
import {MatTableModule, MatIconModule, MatPaginatorModule} from '@angular/material';
import { ImportXlsx2Component } from './import-xlsx-2/import-xlsx-2.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule,   MatTableModule, MatIconModule, MatPaginatorModule ],
  declarations: [ AppComponent, HelloComponent, ImportXlsxComponent, DragDropDirective, ImportXlsx2Component ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
