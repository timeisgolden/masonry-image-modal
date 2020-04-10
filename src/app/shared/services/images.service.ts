import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Ft_image } from '../models.model';
@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(private firestore: AngularFirestore) { }

  // getImages
  getImages() {
    return this.firestore.collection('images').snapshotChanges();
  }

  createImage(image: Ft_image) {
    return this.firestore.collection('images').add(image);
  }

  updateImage(image: Ft_image) {
    delete image.id;
    this.firestore.doc('images/' + image.id).update(image);
  }

  deleteImage(imageId: string) {
    this.firestore.doc('images/' + imageId).delete();
  }
}
