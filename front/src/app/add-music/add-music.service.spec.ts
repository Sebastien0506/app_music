import { TestBed } from '@angular/core/testing';

import { AddMusicService } from './add-music.service';

describe('AddMusicService', () => {
  let service: AddMusicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddMusicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
