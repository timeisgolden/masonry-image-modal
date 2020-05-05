import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountAbtractPipe } from './count-abtract.pipe';

@NgModule({
  declarations: [CountAbtractPipe],
  imports: [
    CommonModule
  ],
  exports: [
    CountAbtractPipe
  ]
})
export class PipesModule { }
