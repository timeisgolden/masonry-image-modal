import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageUploadSoloComponent } from './image-upload-solo.component';

describe('ImageUploadSoloComponent', () => {
  let component: ImageUploadSoloComponent;
  let fixture: ComponentFixture<ImageUploadSoloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageUploadSoloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageUploadSoloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
