import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { DemoMaterialModule } from './material-module';
import { GxChipsModule } from 'projects/gx-chips/src/public-api';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, GxChipsModule, DemoMaterialModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
