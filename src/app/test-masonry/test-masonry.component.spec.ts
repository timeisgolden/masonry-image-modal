import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestMasonryComponent } from './test-masonry.component';

describe('TestMasonryComponent', () => {
  let component: TestMasonryComponent;
  let fixture: ComponentFixture<TestMasonryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestMasonryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestMasonryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
