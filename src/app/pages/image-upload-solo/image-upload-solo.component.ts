import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { ImagesService } from 'app/shared/services/images.service';
import { NGXToastrService } from 'app/shared/services/toastr.service';
import { Ft_image } from 'app/shared/models/models.model';

declare var paypal;

@Component({
  selector: 'app-image-upload-solo',
  templateUrl: './image-upload-solo.component.html',
  styleUrls: ['./image-upload-solo.component.scss'],
  providers: [NGXToastrService]
})
export class ImageUploadSoloComponent implements OnInit {

  solo_price = 100;
  con_mi_familia_price = 250;
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;

  photoForm: FormGroup;
  selectedImage: any = null;
  url: string;
  id: string;
  file: string;
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  pct: number = 0;
  isUploading: boolean = false;
  description: string;

  product = {
    price: 2000,
    description: 'used couch, decent condition',
    img: 'assets/images/solo.jpg'
  }

  constructor(private activatedRoute: ActivatedRoute, private fb: FormBuilder,
    private _formBuilder: FormBuilder, private imageService: ImagesService, private storage: AngularFireStorage,
    private toastService: NGXToastrService) {

    this.activatedRoute.queryParams.subscribe(params => {
      // this.type = params.type;
    });
  }

  ngOnInit() {
    this.photoForm = this._formBuilder.group({
      'first_name': new FormControl('', Validators.required),
      'last_name': new FormControl('', Validators.required),
      'city': new FormControl('', Validators.required),
      'state': new FormControl('', Validators.required),
      'country': new FormControl('', Validators.required),
      'yearOfBirth': new FormControl('', Validators.required),
      'footprint': new FormControl('', Validators.required),
      'essence': new FormControl('', Validators.required),
      'url': [null, Validators.required],
    });

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
              value: that.solo_price
            }
          }]
        });
      },
      onApprove: function (data, actions) {
        // This function captures the funds from the transaction.
        return actions.order.capture().then(function (details) {
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
  openFileBrowser(event: any) {
    var temp = document.getElementById('file_input');
    temp.click();
  }
  fileChangeEvent(event: any): void {
    this.selectedImage = event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(this.selectedImage);
    reader.onload = (_event) => {
      this.photoForm.controls['url'].setValue(reader.result);
    }
    this.pct = 0;
  }

  onSubmitPhotoForm() {
    this.isUploading = true;
    const id = 'pic' + Math.floor(Math.random() * 1000000);
    // storage path
    const path = 'images/' + id;
    // Reference to storage bucket
    const fileRef = this.storage.ref(path);
    // The main task
    this.task = fileRef.put(this.selectedImage);
    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.percentage.subscribe(response => {
      this.pct = response;
    })
    this.task.snapshotChanges().pipe(
      finalize(async () => {
        this.url = await fileRef.getDownloadURL().toPromise();
        let newImage: Ft_image = {
          url: this.url,
          ips: [],
          likes: 0,
          poster: this.photoForm.controls['first_name'].value + " " + this.photoForm.controls['last_name'].value,
          essence: this.photoForm.controls['essence'].value,
          footprint: this.photoForm.controls['footprint'].value,
          city: this.photoForm.controls['city'].value,
          state: this.photoForm.controls['state'].value,
          country: this.photoForm.controls['country'].value,
          yearOfBirth: this.photoForm.controls['yearOfBirth'].value,
          active: false,
          timestamp: new Date().getTime()
        }
        this.imageService.createImage(newImage).then(res => {
          this.isUploading = false;
          this.photoForm.reset();
          this.toastService.typeSuccess('uploaded successfully', 'Image Upload');
        }).catch(error => {
          console.log("saving database error:", JSON.stringify(error));
          this.isUploading = false;
        });
      })
    ).subscribe();
  }

}
