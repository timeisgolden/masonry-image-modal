import { Routes, RouterModule } from '@angular/router';
import { MasonryGalleryComponent } from 'app/pages/masonry-gallery/masonry-gallery.component';
import { ImageUploadSoloComponent } from 'app/pages/image-upload-solo/image-upload-solo.component';
import { ImageUploadFamiliaComponent } from 'app/pages/image-upload-familia/image-upload-familia.component';
import { JoinUsComponent } from 'app/pages/join-us/join-us.component';

//Route for content layout with sidebar, navbar and footer
export const Full_ROUTES: Routes = [
  {
    path: 'changelog',
    loadChildren: () => import('../../changelog/changelog.module').then(m => m.ChangeLogModule)
  },
  {
    path: 'full-layout',
    loadChildren: () => import('../../pages/full-layout-page/full-pages.module').then(m => m.FullPagesModule)
  },
  { path: 'masonry-gallery', component: MasonryGalleryComponent, data: { title: 'Masonry Images' } },
  { path: 'join-us', component: JoinUsComponent, data: { title: 'Join Us' } },
  { path: 'image-upload-solo', component: ImageUploadSoloComponent, data: { title: 'Image Upload For Solo' } },
  { path: 'image-upload-familia', component: ImageUploadFamiliaComponent, data: { title: 'Image Upload For Familia' } },
];
