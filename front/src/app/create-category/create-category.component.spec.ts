import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CreateCategoryComponent } from './create-category.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('CreateCategoryComponent', () => {
  let component: CreateCategoryComponent;
  let fixture: ComponentFixture<CreateCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCategoryComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //On crée le test pour savoir si c'est accepter
  it('should be valid input', () => {
    //On crée le composant que l'on doit tester
    component.nameInput.set('Rap');

    //On utilise la fonction qui permet de vérifier les données
    const result = component.verifyInput()

    //On dit se que l'on attend
    expect(result).toBeTrue();
  });

  //On crée le test pour savoir si c'est refuser
  it('should be invalid input', () => {
    component.nameInput.set('Rap@');

    const result = component.verifyInput();
    expect(result).toBeFalse();
  })
});
