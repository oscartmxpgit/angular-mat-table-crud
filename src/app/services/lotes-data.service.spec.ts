import { TestBed } from '@angular/core/testing';

import { LotesDataService } from './lotes-data.service';

describe('LotesDataService', () => {
  let service: LotesDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LotesDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
