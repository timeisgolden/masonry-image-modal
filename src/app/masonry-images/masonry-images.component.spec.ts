import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasonryImagesComponent } from './masonry-images.component';

describe('MasonryImagesComponent', () => {
  let component: MasonryImagesComponent;
  let fixture: ComponentFixture<MasonryImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasonryImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasonryImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
