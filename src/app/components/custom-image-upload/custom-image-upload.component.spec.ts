import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomImageUploadComponent } from './custom-image-upload.component';

describe('CustomImageUploadComponent', () => {
  let component: CustomImageUploadComponent;
  let fixture: ComponentFixture<CustomImageUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomImageUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
