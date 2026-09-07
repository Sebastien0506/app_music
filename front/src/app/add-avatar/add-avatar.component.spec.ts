import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AddAvatarComponent } from './add-avatar.component';

describe('AddAvatarComponent', () => {
  let component: AddAvatarComponent;
  let fixture: ComponentFixture<AddAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAvatarComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //On test si le fichier est correct
  it('should be true', () => {
    //On crée le fichier
    const file = new File(
      ['dummy content'],
      'avatar.png',
      { type: 'image/png'}
    );
    //On donne à selectedFile le fichier
    component.selectedFile = file;
   
    //On vérifie avec la fonction verifyInput si le fichier est correct
    const result = component.verifyInput();

    //On renvoi la reponse
    expect(result).toBeTrue();
  });

  //On test si l'extention du fichier est incorrect
  it('should be false', () => {
    const file = new File(
      ['dummy content'],
      'avatar.mp3',
      {type: 'image/png'}
    );
    component.selectedFile = file;

    const result = component.verifyInput();

    expect(result).toBeFalse();
    expect(component.errorMessage()).toBe("L'extention du fichier n'est pas autorisé.");
  });

  //On test si le nom du fichier contient des caractères non autorisée.
  it('should be invalid input', () => {
    const file = new File(
      ['dummy content'],
      'av@tar.png',
      {type: 'image/png'}
    );

    component.selectedFile = file;

    const result = component.verifyInput();

    expect(result).toBeFalse();
    expect(component.errorMessage()).toBe("Le nom de l'image contient des caractères non autorisé.");
  });
});
