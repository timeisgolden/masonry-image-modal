import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { NgxMasonryOptions } from 'ngx-masonry';
import { Lightbox } from '../lightbox-modal';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ImagesService } from 'src/app/shared/services/images.service';
import { Ft_image } from 'src/app/shared/models.model';
import { from, of, Subject } from 'rxjs';
import { takeUntil, mergeMap } from 'rxjs/operators';

// import { Lightbox } from '../lightbox-modal';

@Component({
  selector: 'app-masonry-images',
  templateUrl: './masonry-images.component.html',
  styleUrls: ['./masonry-images.component.scss']
})
export class MasonryImagesComponent implements OnInit, OnDestroy {
  _initload: boolean = true;
  @ViewChild('tabsContentRef', { static: true }) tabsContentRef: ElementRef;
  // @ViewChild("tabsContentRef") tabsContentRef: ElementRef;
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

  private _unsubscribeAll: Subject<any> = new Subject();;
  constructor(
    private _lightbox: Lightbox, public deviceService: DeviceDetectorService, private imagesService: ImagesService
  ) {
    this.ipAddress = localStorage.getItem('fp_currentid');
    this.imagesService.getImageChanges()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(snapshotChanges => {
        // console.log("changed snapshot:", snapshotChanges);
        snapshotChanges.forEach(snapshotChange => {
          console.log("snashotChange:", snapshotChange.type);
          
          if (snapshotChange.type === 'modified') {
            let nindex = this._albums.findIndex(album => { return album.id === snapshotChange.payload.doc.id });
            let ips: any[] = snapshotChange.payload.doc.data().ips ? snapshotChange.payload.doc.data().ips : [];
            let nfootprintedIndex = ips.findIndex(x => { return x === this.ipAddress });
            this._albums[nindex].likes = snapshotChange.payload.doc.data().likes ? snapshotChange.payload.doc.data().likes : 0
            this._albums[nindex].essence = snapshotChange.payload.doc.data().essence ? snapshotChange.payload.doc.data().essence : ''
            this._albums[nindex].footprint = snapshotChange.payload.doc.data().footprint ? snapshotChange.payload.doc.data().footprint : ''
            this._albums[nindex].ips = ips;
            this._albums[nindex].footPrinted = nfootprintedIndex > -1 ? true : false;
          }
        })
      })
  }
  ngOnInit() {
    if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
      this._isMobile = true;
    } else {
      this._isMobile = false;
    }

    // this.imagesService.getImages()
    //   .pipe(takeUntil(this._unsubscribeAll))
    this.imagesService.getImages()
      .then(data => {
        this._albums = [];
        let images: any[] = []
        data.docChanges().forEach(docData => {
          images.push({
            id: docData.doc.id,
            data: docData.doc.data()
          })
        });
        console.log(">>>>>>>>>>", images);
        
        for (let index = 0; index < images.length; index++) {
          const image: any = images[index];
          let ips: any[] = image.data.ips ? image.data.ips : [];
          let nfootprintedIndex = ips.findIndex(x => { return x === this.ipAddress });
          this._albums.push(
            {
              id: image.id,
              url: image.data.url,
              ips: image.data.ips ? image.data.ips : [],
              likes: image.data.likes ? image.data.likes : 0,
              essence: image.data.essence ? image.data.essence : '',
              footprint: image.data.footprint ? image.data.footprint : '',
              isShow: false,
              footPrinted: nfootprintedIndex === -1 ? false : true
            }
          )
        }
        this.masonryImages = this._albums.slice(0, this.limit);
        console.log("this.albums:", this._albums);

        // from(this._albums)
        //   .pipe(
        //     mergeMap(album => this.getLike(album))
        //   )
        //   .subscribe(like => {
        //     like.playerObs.subscribe(detail => {
        //       let data = detail.data();
        //       this._albums[like.nIndex]['like'] = data.count;
        //     })
        //   });


      });
    this.gotoTop();
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  gotoTop() {
    this.tabsContentRef.nativeElement.scrollTo(0, 0);
  }
  showMoreImages() {
    this.limit += 15;
    this.masonryImages = this._albums.slice(0, this.limit);
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
    // if (!this._initload) {
    this.showMoreImages();
    // } else {
    //   this._initload = !this._initload;
    // }
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
