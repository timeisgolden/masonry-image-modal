import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageUploadFamiliaComponent } from './image-upload-familia.component';

describe('ImageUploadFamiliaComponent', () => {
  let component: ImageUploadFamiliaComponent;
  let fixture: ComponentFixture<ImageUploadFamiliaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageUploadFamiliaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageUploadFamiliaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
