import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class IpService {

  constructor(private firestore: AngularFirestore) { }

  // getips
  getImages() {
    return this.firestore.collection('ips').snapshotChanges();
  }

  createImage(image: any) {
    return this.firestore.collection('ips').add(image);
  }

  updateImage(image: any) {
    delete image.id;
    this.firestore.doc('ips/' + image.id).update(image);
  }

  deleteImage(imageId: string) {
    this.firestore.doc('ips/' + imageId).delete();
  }
}
