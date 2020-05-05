import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { NgxMasonryOptions } from 'ngx-masonry';
import { Lightbox } from 'app/components/lightbox-modal';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ImagesService } from 'app/shared/services/images.service';
import { IpDetectService } from 'app/shared/services/ip-detect.service';
import { takeUntil } from 'rxjs/operators';
import { QuerySnapshot, DocumentData } from '@angular/fire/firestore';
import { Ft_image } from 'app/shared/models/models.model';
import { PerfectScrollbarDirective, PerfectScrollbarComponent, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-masonry-gallery',
  templateUrl: './masonry-gallery.component.html',
  styleUrls: ['./masonry-gallery.component.scss']
})
export class MasonryGalleryComponent implements OnInit, OnDestroy {

  public config: PerfectScrollbarConfigInterface = {
    scrollYMarginOffset: 0
  };

  @ViewChild(PerfectScrollbarComponent, { static: false }) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective, { static: false }) directiveRef?: PerfectScrollbarDirective;


  _initload: boolean = true;
  @ViewChild('tabsContentRef', { static: true }) tabsContentRef: ElementRef;
  public masonryOptions: NgxMasonryOptions = {
    gutter: 20,
  };

  masonryImages;
  limit = 15;
  _images: Ft_image[] = [];
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
    this.ipAddress = localStorage.getItem('fp_myip');
  }
  ngOnInit() {
    this.imagesService.getImageChanges()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(snapshotChanges => {
        this.ipAddress = localStorage.getItem('fp_myip');
        snapshotChanges.forEach(snapshotChange => {
          if (snapshotChange.type === 'modified') {
            let nindex = this._images.findIndex(image => { return image.id === snapshotChange.payload.doc.id });
            let ips: any[] = snapshotChange.payload.doc.data().ips ? snapshotChange.payload.doc.data().ips : [];
            let nfootprintedIndex = ips.findIndex(x => { return x == this.ipAddress });
            if (nindex > -1) {
              this._images[nindex].likes = snapshotChange.payload.doc.data().likes ? snapshotChange.payload.doc.data().likes : 0
              this._images[nindex].essence = snapshotChange.payload.doc.data().essence ? snapshotChange.payload.doc.data().essence : ''
              this._images[nindex].footprint = snapshotChange.payload.doc.data().footprint ? snapshotChange.payload.doc.data().footprint : ''
              this._images[nindex].ips = ips;
              this._images[nindex].footPrinted = nfootprintedIndex > -1 ? true : false;
            }
          }
        })
      })

    if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
      this._isMobile = true;
    } else {
      this._isMobile = false;
    }


    // load 
    this.imagesService.getImages().then(data => {
      console.log("init load images:", data.docChanges());
      
      this._images = [];
      if (data.docChanges().length === 0) return;

      this.firstInResponse = data.docChanges()[0].doc;
      this.lastInResponse = data.docChanges()[data.docChanges().length - 1].doc;
      if (!this.ipAddress || this.ipAddress === 'null') {
        this.ip.getIPAddress().subscribe((res: any) => {
          this.ipAddress = res.ip;
          localStorage.setItem('fp_myip', this.ipAddress);
          this.convertDocsToArray(data);
        });
      } else {
        this.convertDocsToArray(data);
      }

    });
    this.gotoTop();
  }
  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  convertDocsToArray(data: QuerySnapshot<DocumentData>) {
    data.docChanges().forEach(docData => {
      const image: any = docData.doc.data();
      if (this._images.findIndex(x => { return x.id === docData.doc.id}) > -1) {
        return;
      }

      let ips: any[] = image.ips ? image.ips : [];
      let nfootprintedIndex = ips.findIndex(x => { return x === this.ipAddress });
      this._images.push(
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

    console.log(">>>>>>>>>>>>>this._images:", this._images);
    
  }

  gotoTop() {
    this.tabsContentRef.nativeElement.scrollTo(0, 0);
  }

  /**
   * when mouse scroll down, will load more images.
   */
  showMoreImages() {
    this.imagesService.getNextImages(this.lastInResponse).then(data => {
      // console.log(">>>>>>>>>>>show more images:", data.docChanges());
      
      if (!data.docChanges().length) {
        return;
      }
      this.firstInResponse = data.docChanges()[0].doc;
      this.lastInResponse = data.docChanges()[data.docChanges().length - 1].doc;
      this.convertDocsToArray(data);
    })
  }

  /**
   * when click any image, will show lightbox modal.
   * @param index selected image index
   */
  open(index: number): void {
    if (this._isMobile) {
      this._images[index].isShow = !this._images[index].isShow
      return;
    }
    // open lightbox
    this._lightbox.open(this._images, index, { alwaysShowNavOnTouchDevices: true, wrapAround: true, showImageNumberLabel: true, centerVertically: true });
  }

  /**
   * 
   */
  onScroll() {

    this.showMoreImages();
  }

  /**
   * 
   * @param image selected image
   */
  onClickFootprint(image) {
    if (!this.ipAddress) return;
    let findex = image.ips.findIndex(x => { return x === this.ipAddress });
    if (findex > -1) {
      image.ips.splice(findex, 1);
      image.likes--;
    } else {
      image.ips.push(this.ipAddress)
      image.likes++;
    }
    let nfootprintedIndex = image.ips.findIndex(x => { return x === this.ipAddress });
    image.footPrinted = nfootprintedIndex > -1 ? true : false;

    this.imagesService.doLikeImage(image)
  }


  public scrollToTop(): void {
    // if (this.type === 'directive' && this.directiveRef) {
    //   this.directiveRef.scrollToTop();
    // } else if (this.type === 'component' && this.componentRef && this.componentRef.directiveRef) {
      this.componentRef.directiveRef.scrollToTop();
    // }
  }

  public scrollToBottom(): void {
    // if (this.type === 'directive' && this.directiveRef) {
    //   this.directiveRef.scrollToBottom();
    // } else if (this.type === 'component' && this.componentRef && this.componentRef.directiveRef) {
      this.componentRef.directiveRef.scrollToBottom();
    // }
  }

  public onScrollEvent(event: any): void {
    // console.log("more images:", event);
    this.showMoreImages();
  }

}
