import { TestBed } from '@angular/core/testing';

import { DisplayFavoriteService } from './display-favorite.service';

describe('DisplayFavoriteService', () => {
  let service: DisplayFavoriteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisplayFavoriteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
