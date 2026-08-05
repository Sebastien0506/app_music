import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AddMusicComponent } from './add-music.component';

describe('AddMusicComponent', () => {
  let component: AddMusicComponent;
  let fixture: ComponentFixture<AddMusicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMusicComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should return true for a valid mp3 file', () => {
    const file = new File(
      ["fake music"],
      "music.mp3",
      {
        type: "audio/mpeg"
      }
    );
    component.selectedFile = file;
    expect(component.verifyFile()).toBeTrue();
  });

  it('should be false for invalid extension file', () => {
    const file = new File(
      ["Fake music"],
      "music.exe",
      {
        type: "audio/mpeg"
      }
    );
    component.selectedFile = file;
    expect(component.verifyFile()).toBeFalse();
  });

  it('should be true for valid size file', () => {
    const content = new Uint8Array(21 * 1024 * 1024);
    const file = new File(
      [content],
      "music.mp3",
      {
        type: "audio/mpeg"
      }
    );
    component.selectedFile = file;
    expect(component.verifyFile()).toBeFalse();

  });
  it('should be false for invalide filename', () => {
    const file = new File(
      [""],
      ".mp3",
      {
        type: "audio/mpeg"
      }
    );
    component.selectedFile = file;
    expect(component.verifyFile()).toBeFalse();
  });

  it('should be false for not file', () => {
     component.selectedFile = null;

     const result = component.verifyFile();
     
     expect(result).toBeFalse();
     expect(component.errorMessage()).toBe("Aucun fichier sélectionné.")
  });
});
