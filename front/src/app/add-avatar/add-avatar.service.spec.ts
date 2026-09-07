import { TestBed } from '@angular/core/testing';

import { AddAvatarService } from './add-avatar.service';

describe('AddAvatarService', () => {
  let service: AddAvatarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddAvatarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
