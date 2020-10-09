import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GxChipsComponent } from "./gx-chips.component";
import { LongPressDirective } from './long-press';
import { DemoMaterialModule } from 'demo/app/material-module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [CommonModule, DemoMaterialModule, BrowserAnimationsModule],
  declarations: [GxChipsComponent, LongPressDirective],
  exports: [GxChipsComponent, DemoMaterialModule]
})
export class GxChipsModule { }
