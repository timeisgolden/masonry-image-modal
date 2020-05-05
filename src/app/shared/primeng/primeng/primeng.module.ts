import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import {DropdownModule} from 'primeng/dropdown';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // AccordionModule
    CardModule,
    ButtonModule,
    PanelModule,
    MessagesModule, MessageModule,
    DropdownModule
  ],
  exports: [
    // AccordionModule
    CardModule,
    ButtonModule,
    PanelModule,
    MessagesModule, MessageModule,
    DropdownModule
  ]
})
export class PrimengModule { }
