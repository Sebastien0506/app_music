import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { provideHttpClient } from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import { provideNoopAnimations} from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should accept valid inputs', () => {
    component.emailInput.set('dec@gmail.com');
    component.passwordInput.set('Password@1');

    component.verifyInput();

    expect(component.errorMessage()).toBe('');
    

  });
  it('should show an error when a field is empty', () => {
    component.emailInput.set('');
    component.passwordInput.set('Password@1');

    component.verifyInput();

    expect(component.errorMessage()).toBe('Veuillez remplir tous les champs.');
    

  });
});
