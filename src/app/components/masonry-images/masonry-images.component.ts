import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { NgxMasonryOptions } from 'ngx-masonry';
import { Lightbox } from '../lightbox-modal';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ImagesService } from 'src/app/shared/services/images.service';
import { Ft_image } from 'src/app/shared/models.model';
import { from, of, Subject } from 'rxjs';
import { takeUntil, mergeMap } from 'rxjs/operators';
import { QuerySnapshot, DocumentData } from '@angular/fire/firestore';
import { IpDetectService } from 'src/app/shared/services/ip-detect.service';

// import { Lightbox } from '../lightbox-modal';

@Component({
  selector: 'app-masonry-images',
  templateUrl: './masonry-images.component.html',
  styleUrls: ['./masonry-images.component.scss']
})
export class MasonryImagesComponent implements OnInit, OnDestroy {
  _initload: boolean = true;
  @ViewChild('tabsContentRef', { static: true }) tabsContentRef: ElementRef;
  public masonryOptions: NgxMasonryOptions = {
    transitionDuration: '0.2s',
    gutter: 20,
    resize: true,
    initLayout: true,
    fitWidth: true
  };

  masonryImages;
  limit = 15;
  _albums: Ft_image[] = [];
  _isMobile: boolean = false;
  ipAddress: any;

  //Save first document in snapshot of items received
  firstInResponse: any = [];
  //Save last document in snapshot of items received
  lastInResponse: any = [];

  private _unsubscribeAll: Subject<any> = new Subject();;
  constructor(
    private _lightbox: Lightbox, public deviceService: DeviceDetectorService, private imagesService: ImagesService,
    private ip: IpDetectService
  ) {
    this.ipAddress = localStorage.getItem('fp_currentid');

  }
  ngOnInit() {
    this.imagesService.getImageChanges()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(snapshotChanges => {
        this.ipAddress = localStorage.getItem('fp_currentid');
        snapshotChanges.forEach(snapshotChange => {
          if (snapshotChange.type === 'modified') {
            let nindex = this._albums.findIndex(album => { return album.id === snapshotChange.payload.doc.id });
            let ips: any[] = snapshotChange.payload.doc.data().ips ? snapshotChange.payload.doc.data().ips : [];
            let nfootprintedIndex = ips.findIndex(x => { return x == this.ipAddress });
            this._albums[nindex].likes = snapshotChange.payload.doc.data().likes ? snapshotChange.payload.doc.data().likes : 0
            this._albums[nindex].essence = snapshotChange.payload.doc.data().essence ? snapshotChange.payload.doc.data().essence : ''
            this._albums[nindex].footprint = snapshotChange.payload.doc.data().footprint ? snapshotChange.payload.doc.data().footprint : ''
            this._albums[nindex].ips = ips;
            this._albums[nindex].footPrinted = nfootprintedIndex > -1 ? true : false;
          }
        })
      })

    if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
      this._isMobile = true;
    } else {
      this._isMobile = false;
    }
    this.imagesService.getImages().then(data => {
      this._albums = [];
      this.firstInResponse = data.docChanges()[0].doc;
      this.lastInResponse = data.docChanges()[data.docChanges().length - 1].doc;
      this.convertDocsToArray(data);
    });
    this.gotoTop();
  }
  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  convertDocsToArray(data: QuerySnapshot<DocumentData>) {
    if (!this.ipAddress || this.ipAddress === 'null') {
      this.ip.getIPAddress().subscribe((res: any) => {
        this.ipAddress = res.ip;
        localStorage.setItem('fp_currentid', this.ipAddress);
        data.docChanges().forEach(docData => {
          const image: any = docData.doc.data();
          let ips: any[] = image.ips ? image.ips : [];
          let nfootprintedIndex = ips.findIndex(x => { return x === this.ipAddress });
          this._albums.push(
            {
              id: docData.doc.id,
              url: image.url,
              ips: image.ips ? image.ips : [],
              likes: image.likes ? image.likes : 0,
              poster: image.poster ? image.poster : 'Unknown',
              essence: image.essence ? image.essence : '',
              footprint: image.footprint ? image.footprint : '',
              timestamp: image.timestamp,
              isShow: false,
              footPrinted: nfootprintedIndex === -1 ? false : true
            }
          )
        });
      });
    } else {
      data.docChanges().forEach(docData => {
        const image: any = docData.doc.data();
        let ips: any[] = image.ips ? image.ips : [];
        let nfootprintedIndex = ips.findIndex(x => { return x === this.ipAddress });
        this._albums.push(
          {
            id: docData.doc.id,
            url: image.url,
            ips: image.ips ? image.ips : [],
            likes: image.likes ? image.likes : 0,
            poster: image.poster ? image.poster : 'Unknown',
            essence: image.essence ? image.essence : '',
            footprint: image.footprint ? image.footprint : '',
            timestamp: image.timestamp,
            isShow: false,
            footPrinted: nfootprintedIndex === -1 ? false : true
          }
        )
      });
    }
  }

  gotoTop() {
    this.tabsContentRef.nativeElement.scrollTo(0, 0);
  }
  showMoreImages() {
    this.imagesService.getNextImages(this.lastInResponse).then(data => {
      console.log(">>>>>>>>>>>>>>next data;");
      if (!data.docChanges().length) {
        return;
      }
      this.firstInResponse = data.docChanges()[0].doc;
      this.lastInResponse = data.docChanges()[data.docChanges().length - 1].doc;
      this.convertDocsToArray(data);
      console.log("this._albums:", this._albums);
    })
  }
  open(index: number): void {
    if (this._isMobile) {
      this._albums[index].isShow = !this._albums[index].isShow
      // this.imagesService.doUpdateShowImage(this._albums[index])
      return;
    }
    // open lightbox
    this._lightbox.open(this._albums, index, { alwaysShowNavOnTouchDevices: true, wrapAround: true, showImageNumberLabel: true, centerVertically: true });
  }
  onScroll() {
    console.log('scrolled!!');
    this.showMoreImages();
  }

  // getLike = (album) => {
  //   return of({
  //     playerObs: this.imagesService.getLikeOfImage(album),
  //     nIndex: album.nindex
  //   });
  // }

  onClickFootprint(album) {
    if (!this.ipAddress) return;
    let findex = album.ips.findIndex(x => { return x === this.ipAddress });
    if (findex > -1) {
      album.ips.splice(findex, 1);
      album.likes--;
    } else {
      album.ips.push(this.ipAddress)
      album.likes++;
    }
    let nfootprintedIndex = album.ips.findIndex(x => { return x === this.ipAddress });
    album.footPrinted = nfootprintedIndex > -1 ? true : false;

    this.imagesService.doLikeImage(album)
  }
}
