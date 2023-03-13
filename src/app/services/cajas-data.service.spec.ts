import { TestBed } from '@angular/core/testing';

import { CajasDataService } from './cajas-data.service';

describe('CajasDataService', () => {
  let service: CajasDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CajasDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
