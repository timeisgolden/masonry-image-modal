import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { finalize } from 'rxjs/operators';
import { ImagesService } from 'src/app/shared/services/images.service';
import { Ft_image } from 'src/app/shared/models.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {

  photoForm: FormGroup;
  selectedImage: any = null;
  url: string;
  id: string;
  file: string;
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  pct: number = 0;
  isUploading: boolean = false;

  constructor(
    private _formBuilder: FormBuilder, private imageService: ImagesService, private storage: AngularFireStorage,
    private toastr: ToastrService
  ) { }
  ngOnInit() {
    this.photoForm = this._formBuilder.group({
      'url': [null, Validators.required],
      'essence': ['', Validators.required],
      'footprint': ['', Validators.required]
    });
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
    console.log(this.selectedImage);
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
          essence: this.photoForm.controls['essence'].value,
          footprint: this.photoForm.controls['footprint'].value,
          timestamp: new Date().getTime()
        }
        console.log("newImage:", newImage);
        
        this.imageService.createImage(newImage).then(res => {
          this.isUploading = false;
          this.photoForm.reset();
          this.toastr.success('uploaded successfully', 'Image Upload');
        });
      })
    ).subscribe(snapshot => {
      // console.log(">>>>>>>", snapshot);
    })
  }
  view() {
    // this.fileService.getImage(this.file);
  }
}
