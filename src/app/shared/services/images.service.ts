import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Ft_image } from '../models.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  collectionName: string = 'images';
  constructor(private firestore: AngularFirestore) { }
  /**
   * when someone like images, will get updated images.
   */
  getImageChanges(): Observable<any> {
    return this.firestore.collection(this.collectionName).snapshotChanges();
  }

  /**
   * get images with limit 20
   */
  getImages() {
    return this.firestore.collection(this.collectionName).ref.limit(20).orderBy('timestamp', 'desc').get();
  }
  /**
   * get next images
   * @param lastInResponse 
   */
  getNextImages(lastInResponse) {
    return this.firestore.collection(this.collectionName).ref
      .limit(20)
      .orderBy('timestamp', 'desc')
      .startAfter(lastInResponse)
      .get();
  }

  createImage(image: Ft_image) {
    return this.firestore.collection(this.collectionName).add(image);
  }

  updateImage(image: Ft_image) {
    delete image.id;
    this.firestore.doc(this.collectionName + '/' + image.id).update(image);
  }

  deleteImage(imageId: string) {
    this.firestore.doc(this.collectionName + '/' + imageId).delete();
  }

  getLikeOfImage(album) {
    let ipAddress = localStorage.getItem('fp_myip');
    return this.firestore.doc(this.collectionName + "/" + album.id).collection('likes').doc(ipAddress).get();
  }

  doLikeImage(image: Ft_image) {
    this.firestore.doc(this.collectionName + '/' + image.id).set({
      ips: image.ips,
      likes: image.likes,
      url: image.url,
      isShow: image.isShow,
      poster: image.poster,
      essence: image.essence,
      footprint: image.footprint,
      timestamp: image.timestamp
    });
  }
}
