import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { UserUpdateComponent } from './user-update.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('UserUpdateComponent', () => {
  let component: UserUpdateComponent;
  let fixture: ComponentFixture<UserUpdateComponent>;
  const userMock = {
    userData: {
      username: 'Sebastien',
      last_name: 'Dec',
      email: "dec05@gmail.com",
    }
    
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserUpdateComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: userMock
           
        },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept input', () => {
    component.usernameInput = 'Sebastien';
    component.last_nameInput = 'Dec';
    component.emailInput = 'dec05@gmail.com';
  
    const result = component.verifyInput();
  
    expect(result).toBeTrue();
  });
  
  it('should unaccept input username', () => {
    component.usernameInput = '';
    component.last_nameInput = 'Dec';
    component.emailInput = 'dec05@gmail.com';
  
    component.verifyInput();
  
    expect(component.errorMessage()).toBe('Un champs est manquant.');
  });
  
  it('should unaccept input last_name', () => {
    component.usernameInput = 'Sebastien';
    component.last_nameInput = 'Dec1';
    component.emailInput = 'dec05@gmail.com';
  
    component.verifyInput();
  
    expect(component.errorMessage()).toBe(
      "Le champ 'Prénom' contient des caractère non autorisé"
    );
  });

  it('should unaccept input email', () => {
    component.usernameInput = 'Sebastien';
    component.last_nameInput = 'Dec';
    component.emailInput = 'dec05gmail';
  
    component.verifyInput();
  
    expect(component.errorMessage()).toBe("L'email est incorrect.");
  });

});
