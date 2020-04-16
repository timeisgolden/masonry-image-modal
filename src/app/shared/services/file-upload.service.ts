import { Injectable } from '@angular/core';
import { Ft_image } from '../models.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  // imageDetailList: AngularFireList<any>;
  fileList: any[];
  // dataSet: Ft_image = {
  //   id: '',
  //   url: ''
  // };
  msg: string = 'error';

  constructor(private storage: AngularFireStorage, private firestore: AngularFirestore) { }

  getImageDetailList() {
    // this.firestore.collection('images').get();
  }
  // insertImageDetails(id, url) {
  //   this.dataSet = {
  //     id: id,
  //     url: url
  //   };
  //   this.imageDetailList.push(this.dataSet);
  // }
  // getImage(value) {
  //   this.imageDetailList.snapshotChanges().subscribe(
  //     list => {
  //       this.fileList = list.map(item => { return item.payload.val(); });
  //       this.fileList.forEach(element => {
  //         if (element.id === value)
  //           this.msg = element.url;
  //       }); if (this.msg === 'error')
  //         alert('No record found');
  //       else {
  //         window.open(this.msg);
  //         this.msg = 'error';
  //       }
  //     }
  //   );
  // }
}
