import { TestBed } from '@angular/core/testing';
import { UserUpdateComponent } from './user-update.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { UserUpdateService } from './user-update.service';

describe('UserUpdateService', () => {
  let service: UserUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
