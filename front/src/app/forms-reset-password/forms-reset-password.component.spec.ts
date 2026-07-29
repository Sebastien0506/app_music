import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsResetPasswordComponent } from './forms-reset-password.component';

describe('FormsResetPasswordComponent', () => {
  let component: FormsResetPasswordComponent;
  let fixture: ComponentFixture<FormsResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsResetPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormsResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
