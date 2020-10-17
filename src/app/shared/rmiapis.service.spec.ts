import { TestBed } from '@angular/core/testing';

import { RMIAPIsService } from './rmiapis.service';

describe('RMIAPIsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RMIAPIsService = TestBed.get(RMIAPIsService);
    expect(service).toBeTruthy();
  });
});
