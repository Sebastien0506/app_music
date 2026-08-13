import { TestBed } from '@angular/core/testing';

import { InfoMusicService } from './info-music.service';

describe('InfoMusicService', () => {
  let service: InfoMusicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfoMusicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
