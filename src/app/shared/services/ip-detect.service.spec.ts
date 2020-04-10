import { TestBed } from '@angular/core/testing';

import { IpDetectService } from './ip-detect.service';

describe('IpDetectService', () => {
  let service: IpDetectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IpDetectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
