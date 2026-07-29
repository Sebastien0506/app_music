import { TestBed } from '@angular/core/testing';

import { FormsResetPasswordService } from './forms-reset-password.service';

describe('FormsResetPasswordService', () => {
  let service: FormsResetPasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormsResetPasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
