import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Reactive Form
import { ReactiveFormsModule } from "@angular/forms";

// App routing modules
import { AppRoutingModule } from './shared/routing/app-routing.module';

// App components
import { AppComponent } from './app.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { HttpClientModule } from "@angular/common/http";

// Firebase services + enviorment module
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import {
  AngularFireStorageModule,
  AngularFireStorageReference,
  AngularFireUploadTask,
  StorageBucket
} from "@angular/fire/storage";
import { environment } from '../environments/environment';

// Auth service
import { AuthService } from "./shared/services/auth.service";

// for masonry image modal
import { NgxMasonryModule } from 'ngx-masonry';
// import { LightboxModule } from 'ngx-lightbox';
import { LightboxModule } from './components/lightbox-modal';
import { MasonryImagesComponent } from './components/masonry-images/masonry-images.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { MatIconModule } from "@angular/material/icon";
import { MaterialModule } from './shared/material/material.module';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { PipesModule } from './shared/pipes/pipes.module';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
 
import { ToastrModule } from 'ngx-toastr';
@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    DashboardComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    MasonryImagesComponent,
    ImageUploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,

    ReactiveFormsModule,
    NgxMasonryModule,
    LightboxModule,
    MaterialModule,
    BrowserAnimationsModule,
    DeviceDetectorModule.forRoot(),
    InfiniteScrollModule,
    HttpClientModule,
    PipesModule,
    ToastrModule.forRoot()
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class AppModule { }
platformBrowserDynamic().bootstrapModule(AppModule);