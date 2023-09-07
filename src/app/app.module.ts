import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DndModule } from 'ngx-drag-drop';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [AppComponent],
  providers: [],
  imports: [BrowserModule, DndModule, FormsModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
