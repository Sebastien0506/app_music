import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { UpdateMusicComponent } from './update-music.component';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';
describe('UpdateMusicComponent', () => {
  let component: UpdateMusicComponent;
  let fixture: ComponentFixture<UpdateMusicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateMusicComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        {
          provide: MatDialogRef,
          useValue: {
            close: jasmine.createSpy('close')
          }
        },
        {
           provide: MAT_DIALOG_DATA,
           useValue: {
            dataMusic: {
              id: 1,
              title: 'Rap God',
              category: null,
              duration: 253,
              size: 5000000,
              file: '/media/music/test.mp3'
            }
           }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateMusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('should valid input', () => {
    component.titleInput.set('Rap God');
    const result = component.verifyInput();
    
    const chekbox = document.createElement('input');

    chekbox.type = 'checkbox';
    chekbox.value = '1';
    chekbox.checked = true ;

    const event = new Event('change');
    Object.defineProperty(event, 'target', {
      value: chekbox
    });

    component.onCheckBoxValidate(event);
    expect(component.selectedCategoryId).toBe(1);
    expect(result).toBeTrue();
  });

  it('should invalid input', () => {
    component.titleInput.set('');

    const result = component.verifyInput(); 
    
    const chekbox = document.createElement('input');

    chekbox.type = 'checkbox';
    chekbox.value = '1';
    chekbox.checked = true ;

    const event = new Event('change');
    Object.defineProperty(event, 'target', {
      value: chekbox
    });

    component.onCheckBoxValidate(event);
    expect(component.selectedCategoryId).toBe(1);
    expect(result).toBeFalse();
  });

  it('should invalid checkbox', () => {
    component.titleInput.set('Rap God');

    const result = component.verifyInput();

    const checkbox = document.createElement('input');

    checkbox.type = 'checkbox';
    checkbox.value = '';
    checkbox.checked = false;

    const event = new Event('change');
    Object.defineProperty(event, 'target', {
      value: checkbox
    });

    component.onCheckBoxValidate(event);
    expect(component.selectedCategoryId).toBe(null);
    expect(result).toBeTrue();
  })
});
