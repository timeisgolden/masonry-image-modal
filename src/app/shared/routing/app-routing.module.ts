import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Required components for which route services to be activated
import { SignInComponent } from '../../components/sign-in/sign-in.component';
import { SignUpComponent } from '../../components/sign-up/sign-up.component';
import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { ForgotPasswordComponent } from '../../components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from '../../components/verify-email/verify-email.component';

// Import canActivate guard services
import { AuthGuard } from "../../shared/guard/auth.guard";
import { SecureInnerPagesGuard } from "../../shared/guard/secure-inner-pages.guard";
import { MasonryImagesComponent } from 'src/app/components/masonry-images/masonry-images.component';
import { ImageUploadComponent } from 'src/app/components/image-upload/image-upload.component';
import { JoinUsComponent } from 'src/app/components/join-us/join-us.component';
import { CustomImageUploadComponent } from 'src/app/components/custom-image-upload/custom-image-upload.component';
import { ImageUploadSoloComponent } from 'src/app/components/image-upload-solo/image-upload-solo.component';
import { ImageUploadFamiliaComponent } from 'src/app/components/image-upload-familia/image-upload-familia.component';

// Include route guard in routes array
const routes: Routes = [
  { path: '', redirectTo: '/masonry-images', pathMatch: 'full' },
  // { path: 'sign-in', component: SignInComponent, canActivate: [SecureInnerPagesGuard] },
  // { path: 'register-user', component: SignUpComponent, canActivate: [SecureInnerPagesGuard] },
  // { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  // { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [SecureInnerPagesGuard] },
  // { path: 'verify-email-address', component: VerifyEmailComponent, canActivate: [SecureInnerPagesGuard] },
  { path: 'masonry-images', component: MasonryImagesComponent },
  { path: 'image-upload', component: ImageUploadComponent },
  { path: 'join-us', component: JoinUsComponent },
  { path: 'custom-image-upload', component: CustomImageUploadComponent },
  { path: 'image-upload-solo', component: ImageUploadSoloComponent },
  { path: 'image-upload-familia', component: ImageUploadFamiliaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }