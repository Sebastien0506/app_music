import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { provideHttpClient } from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import { provideNoopAnimations} from '@angular/platform-browser/animations';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should accept valid inputs', () => {
    component.usernameInput.set('Sébastien');
    component.last_nameInput.set('Dec')
    component.emailInput.set('dec@gmail.com');
    component.passwordInput.set('Password@1');

    component.verifyInput();

    expect(component.errorMessage()).toBe('');
    

  });
  it('should show an error when a field is empty', () => {
    component.usernameInput.set('Sébastien');
    component.last_nameInput.set('Dec');
    component.emailInput.set('');
    component.passwordInput.set('Password@1');

    component.verifyInput();

    expect(component.errorMessage()).toBe('Veuillez remplir tous les champs.');
    

  });
});
