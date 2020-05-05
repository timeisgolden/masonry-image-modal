
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from "./shared/shared.module";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface
} from 'ngx-perfect-scrollbar';

import { AppComponent } from './app.component';
import { ContentLayoutComponent } from "./layouts/content/content-layout.component";
import { FullLayoutComponent } from "./layouts/full/full-layout.component";


import { NgxMasonryModule } from 'ngx-masonry';
import { LightboxModule } from './components/lightbox-modal';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

// Firebase services + enviorment module
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AngularFireStorageModule } from "@angular/fire/storage";
import { environment } from '../environments/environment';

import { AuthService } from './shared/auth/auth.service';
import { AuthGuard } from './shared/auth/auth-guard.service';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { MasonryGalleryComponent } from './pages/masonry-gallery/masonry-gallery.component';
import { JoinUsComponent } from './pages/join-us/join-us.component';
import { ImageUploadSoloComponent } from './pages/image-upload-solo/image-upload-solo.component';
import { ImageUploadFamiliaComponent } from './pages/image-upload-familia/image-upload-familia.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { TestMasonryComponent } from './test-masonry/test-masonry.component';
import { Title } from '@angular/platform-browser';
import { MasonryImagesComponent } from './masonry-images/masonry-images.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false
};

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}


@NgModule({
  declarations: [AppComponent, FullLayoutComponent, ContentLayoutComponent, MasonryGalleryComponent, JoinUsComponent, ImageUploadSoloComponent, ImageUploadFamiliaComponent, TestMasonryComponent, MasonryImagesComponent],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    NgbModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    ReactiveFormsModule,
    PerfectScrollbarModule, InfiniteScrollModule,
    NgxMasonryModule, LightboxModule, DeviceDetectorModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase), AngularFireFunctionsModule,
    AngularFireAuthModule, AngularFirestoreModule, AngularFireStorageModule,
    ToastrModule.forRoot()
  ],
  providers: [
    Title,
    AuthService,
    AuthGuard,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
platformBrowserDynamic().bootstrapModule(AppModule);
