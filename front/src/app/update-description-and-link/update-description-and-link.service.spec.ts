import { TestBed } from '@angular/core/testing';

import { UpdateDescriptionAndLinkService } from './update-description-and-link.service';

describe('UpdateDescriptionAndLinkService', () => {
  let service: UpdateDescriptionAndLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateDescriptionAndLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
