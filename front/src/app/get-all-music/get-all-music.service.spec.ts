import { TestBed } from '@angular/core/testing';

import { GetAllMusicService } from './get-all-music.service';

describe('GetAllMusicService', () => {
  let service: GetAllMusicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetAllMusicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
