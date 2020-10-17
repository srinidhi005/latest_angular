import { TestBed } from '@angular/core/testing';

import { UrlConfigService } from './url-config.service';

describe('UrlConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UrlConfigService = TestBed.get(UrlConfigService);
    expect(service).toBeTruthy();
  });
});
