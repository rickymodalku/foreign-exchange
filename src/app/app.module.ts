import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ForeignExchangeComponent } from './modules/foreign-exchange/foreign-exchange.component';


import { ForeignExchangeService } from './services/foreign-exchange.service';
import { AutoFormatService } from './services/auto-format.service';

import { AutoFormatDirective } from './directives/auto-format.directive';


@NgModule({
  declarations: [
    AppComponent,
    ForeignExchangeComponent,
    AutoFormatDirective
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule],
  providers: [
    ForeignExchangeService,
    AutoFormatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
