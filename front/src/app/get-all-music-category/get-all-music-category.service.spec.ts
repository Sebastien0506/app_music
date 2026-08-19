import { TestBed } from '@angular/core/testing';

import { GetAllMusicCategoryService } from './get-all-music-category.service';

describe('GetAllMusicCategoryService', () => {
  let service: GetAllMusicCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetAllMusicCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
