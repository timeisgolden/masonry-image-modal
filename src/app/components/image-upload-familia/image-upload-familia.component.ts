import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map, finalize } from 'rxjs/operators';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { SelectItem } from 'primeng/api/public_api';
import { ToastrService } from 'ngx-toastr';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { ImagesService } from 'src/app/shared/services/images.service';
import { Observable } from 'rxjs';
import { Ft_image } from 'src/app/shared/models.model';
import { AngularFireFunctions } from '@angular/fire/functions';

declare var paypal;

@Component({
  selector: 'app-image-upload-familia',
  templateUrl: './image-upload-familia.component.html',
  styleUrls: ['./image-upload-familia.component.css']
})
export class ImageUploadFamiliaComponent implements OnInit {
  con_mi_familia_price = 250;
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;

  photoForm: FormGroup;
  isUploadingArr: boolean[] = [false];
  selectedImageArr: any[] = [];
  url: string;
  id: string;
  file: string;
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  pct: number = 0;
  description: string;

  product = {
    price: 2000,
    description: 'used couch, decent condition',
    img: 'assets/images/solo.jpg'
  }

  @ViewChild('alert', { static: true }) alert: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute, private fb: FormBuilder,
    private _formBuilder: FormBuilder, private imageService: ImagesService, private storage: AngularFireStorage,
    private toastr: ToastrService, private fns: AngularFireFunctions
  ) {
    // this.photoForm = this._formBuilder.group({
    //   'name': new FormControl('Test', Validators.required),
    //   'city': new FormControl('Washington', Validators.required),
    //   'state': new FormControl('Test', Validators.required),
    //   'country': new FormControl('United State', Validators.required),
    //   'yearOfBirth': new FormControl('12/12/1999', Validators.required),
    //   'footprint': new FormControl('test footprint', Validators.required),
    //   'essence': new FormControl('test essence', Validators.required),
    //   'url': new FormControl('', Validators.required)
    // });
    this.activatedRoute.queryParams.subscribe(params => {
      // this.type = params.type;
    });
  }

  ngOnInit() {
    this.photoForm = this._formBuilder.group({
      type: 'con-mi-familia',
      photosForFamilia: this._formBuilder.array([this.createPhotoFormGroup()], [Validators.required])
    })

    let that = this;
    paypal.Buttons({
      style: {
        layout: 'horizontal',
        color: 'blue',
        shape: 'rect',
        label: 'checkout',
        tagline: false
      },
      createOrder: function (data, actions) {
        // This function sets up the details of the transaction, including the amount and line item details.
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: that.con_mi_familia_price
            }
          }]
        });
      },
      onApprove: function (data, actions) {
        // This function captures the funds from the transaction.
        return actions.order.capture().then(function (details) {
          // This function shows a transaction success message to your buyer.
          // alert('Transaction completed by ' + details.payer.name.given_name);
          // save image to firebase
          that.onSubmitPhotoForm();
        });
      },
      onError: err => {
        console.log(err);
        alert(JSON.stringify(err));
      }
    }).render(this.paypalElement.nativeElement)
  }

  createPhotoFormGroup() {
    return this._formBuilder.group({
      'name': new FormControl('Test', Validators.required),
      'city': new FormControl('Washington', Validators.required),
      'state': new FormControl('Test', Validators.required),
      'country': new FormControl('United State', Validators.required),
      'yearOfBirth': new FormControl('12/12/1999', Validators.required),
      'footprint': new FormControl('test footprint', Validators.required),
      'essence': new FormControl('test essence', Validators.required),
      'url': new FormControl('', Validators.required),
      'active': new FormControl(false),
      'isUploading': new FormControl(false)
    })
  }
  get photosForFamilia(): FormArray {
    return this.photoForm.get('photosForFamilia') as FormArray;
  }
  addPhotoFamilia() {
    if (this.photosForFamilia.length === 5) return;
    let fg = this.createPhotoFormGroup();
    this.photosForFamilia.push(fg);
  }
  deletePhotoFamilia(idx: number) {
    if (this.photosForFamilia.length === 1) return;
    this.photosForFamilia.removeAt(idx);
  }

  fileChangeEvent(event: any, i: number): void {
    this.selectedImageArr[i] = event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(this.selectedImageArr[i]);
    reader.onload = (_event) => {
      this.photosForFamilia.controls[i].get('url').setValue(reader.result);
    }
    this.pct = 0;
  }

  onSubmitPhotoForm() {
    let i = 0;
    this.photosForFamilia.controls.forEach(photoForFamilia => {
      photoForFamilia.get('isUploading').setValue(true);
      const id = 'pic' + Math.floor(Math.random() * 1000000);
      // storage path
      const path = 'images/' + id;
      // Reference to storage bucket
      const fileRef = this.storage.ref(path);
      // The main task
      this.task = fileRef.put(this.selectedImageArr[i]);
      this.task.snapshotChanges().pipe(
        finalize(async () => {
          this.url = await fileRef.getDownloadURL().toPromise();
          let newImage: any = {
            url: this.url,
            ips: [],
            likes: 0,
            essence: photoForFamilia.get('essence').value,
            footprint: photoForFamilia.get('footprint').value,
            timestamp: new Date().getTime(),
            active: false
          }
          this.imageService.createImage(newImage).then(res => {
            photoForFamilia.get('isUploading').setValue(false);

            this.photosForFamilia.clear();
            this.addPhotoFamilia();
            // this.photoForm.reset();
            this.toastr.success('uploaded successfully', 'Image Upload');
          }).catch(error => {
            console.log("saving database error:", JSON.stringify(error));
            photoForFamilia.get('isUploading').setValue(false);
          });
        })
      ).subscribe();
      i++;
    });
  }

  sendToEmail(newImage) {
    const callable = this.fns.httpsCallable('sendMail');
    callable({ data: newImage }).subscribe(response => {
      console.log("call functions result:", response);
    }, error => {
      console.error("call function result error:", error);
    });
  }

  closeAlert() {
    this.alert.nativeElement.classList.remove('show');
  }
}
