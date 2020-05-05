import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map, finalize } from 'rxjs/operators';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api/public_api';
import { ToastrService } from 'ngx-toastr';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { ImagesService } from 'src/app/shared/services/images.service';
import { Observable } from 'rxjs';
import { Ft_image } from 'src/app/shared/models.model';

declare var paypal;

@Component({
  selector: 'app-image-upload-solo',
  templateUrl: './image-upload-solo.component.html',
  styleUrls: ['./image-upload-solo.component.css']
})
export class ImageUploadSoloComponent implements OnInit {
  // type: string = 'solo';
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
    private toastr: ToastrService) {

    this.activatedRoute.queryParams.subscribe(params => {
      // this.type = params.type;
    });
  }

  ngOnInit() {
    this.photoForm = this._formBuilder.group({
      'name': new FormControl('Test', Validators.required),
      'city': new FormControl('Washington', Validators.required),
      'state': new FormControl('Test', Validators.required),
      'country': new FormControl('United State', Validators.required),
      'yearOfBirth': new FormControl('12/12/1999', Validators.required),
      'footprint': new FormControl('test footprint', Validators.required),
      'essence': new FormControl('test essence', Validators.required),
      // 'images': new FormControl('', Validators.required),
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
          // This function shows a transaction success message to your buyer.
          alert('Transaction completed by ' + details.payer.name.given_name);

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
        let newImage: any = {
          url: this.url,
          ips: [],
          likes: 0,
          essence: this.photoForm.controls['essence'].value,
          footprint: this.photoForm.controls['footprint'].value,
          timestamp: new Date().getTime(),
          active: false
        }
        this.imageService.createImage(newImage).then(res => {
          this.isUploading = false;
          this.photoForm.reset();
          this.toastr.success('uploaded successfully', 'Image Upload');
        }).catch(error => {
          console.log("saving database error:", JSON.stringify(error));
          this.isUploading = false;
        });
      })
    ).subscribe();
  }
}
