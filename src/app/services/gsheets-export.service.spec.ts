import { TestBed } from '@angular/core/testing';

import { GsheetsExportService } from './gsheets-export.service';

describe('GsheetsExportService', () => {
  let service: GsheetsExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GsheetsExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
