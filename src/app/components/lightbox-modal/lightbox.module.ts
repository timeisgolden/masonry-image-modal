import { Lightbox } from './lightbox.service';
import { LightboxComponent } from './lightbox.component';
import { LightboxConfig } from './lightbox-config.service';
import { LightboxEvent, LightboxWindowRef } from './lightbox-event.service';
import { LightboxOverlayComponent } from './lightbox-overlay.component';
import { NgModule } from '@angular/core';
// import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { PipesModule } from 'app/shared/pipes/pipes.module';

@NgModule({
  declarations: [LightboxOverlayComponent, LightboxComponent],
  imports: [
    // MatIconModule,
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
