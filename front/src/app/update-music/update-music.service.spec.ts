import { TestBed } from '@angular/core/testing';

import { UpdateMusicService } from './update-music.service';

describe('UpdateMusicService', () => {
  let service: UpdateMusicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateMusicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
