import { TestBed } from '@angular/core/testing';

import { UserDetailModelService } from './user-detail-model.service';

describe('UserDetailModelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserDetailModelService = TestBed.get(UserDetailModelService);
    expect(service).toBeTruthy();
  });
});
