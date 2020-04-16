import { Lightbox } from './lightbox.service';
import { LightboxComponent } from './lightbox.component';
import { LightboxConfig } from './lightbox-config.service';
import { LightboxEvent, LightboxWindowRef } from './lightbox-event.service';
import { LightboxOverlayComponent } from './lightbox-overlay.component';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [LightboxOverlayComponent, LightboxComponent],
  imports: [
    MatIconModule,
    PipesModule,
    CommonModule
  ],
  providers: [
    Lightbox,
    LightboxConfig,
    LightboxEvent,
    LightboxWindowRef
  ],
  entryComponents: [LightboxOverlayComponent, LightboxComponent]
})
export class LightboxModule { }
