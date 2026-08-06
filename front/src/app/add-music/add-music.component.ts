import { Component, signal } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { max } from 'rxjs';
import { AddMusicService } from './add-music.service';

@Component({
  selector: 'app-add-music',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './add-music.component.html',
  styleUrl: './add-music.component.css'
})
export class AddMusicComponent {

  constructor(private addMusicService: AddMusicService){}
  errorMessage = signal('');
  successMessage = signal('');
   
  //Fichier sélectionné par l'utilisateur
  selectedFile: File | null = null;

  //Récupère le fichier sélectionné dans l'input
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    // Vérifie qu'au moins un fichier a été sélectionné
    if (input.files && input.files.length > 0) {
      //Enregistre le premier fichier sélectionné
      this.selectedFile = input.files[0];

      console.log(this.selectedFile);
    }
  }

  verifyFile(): boolean {
    //Si aucun fichier on envoi un message d'erreur
    if(!this.selectedFile) {
      this.errorMessage.set('Aucun fichier sélectionné.');
      return false
    }
    //On récupère le nom du fichier
    const filename = this.selectedFile.name

    //On récupère le nom avant l'extension
    const nameWithoutExtension = filename.substring(0, filename.lastIndexOf("."));
    //Si aucun nom trouvé on retourne une erreur
    if (!nameWithoutExtension){
      this.errorMessage.set("Le nom de fichier est invalide.");
      return false;
    }
    //On détermine la taille maximal accepter
    const maxSize = 20 * 1024 * 1024;
    if (this.selectedFile.size > maxSize) {
      this.errorMessage.set('Le fichier est trop volumineux.');
      return false
    }
    //On définit les types accepter
    const allowedTypes = [

      "audio/mpeg",
    
      "audio/wav",
    
      "audio/flac",
    
      "audio/x-wav",
    
      "audio/mp4",
    
    ];
    //Si le types n'est pas accepter on envoi un message d'erreur
    if (!allowedTypes.includes(this.selectedFile.type)) {
      this.errorMessage.set("Le type du fichier n'est pas autorisé.");
      return false
    }

    //On récupère l'extension (mp3, mp4, etc)
    const extension = this.selectedFile.name.split(".").pop()?.toLowerCase();


    //On renseigne les extension autorisé.
    const allowedExtensions = [

      "mp3",

      "wav",

      "flac",

      "m4a",

    ];
    //Si l'extension n'est pas autorisée on renvoi un message d'erreur
    if(!allowedExtensions.includes(extension ?? "")){
      this.errorMessage.set("L'extension du fichier n'est pas autorisée.");
      return false
    }
    return true

    
  }

  //On envoi la requête
  sendRequest(): void {
    //On vérifie le fichier
    if(!this.verifyFile){
      return;
    }
    console.log(this.verifyFile());
    //On déclare la varianle forData
    const formData = new FormData;
    //On lui met le fichier
    formData.append("music", this.selectedFile!);
    console.log(formData);


    //On envoi la requête
    this.addMusicService.uploadMusic(formData).subscribe({
      next:(res) => {
         this.successMessage.set('Musique Ajouter avec succès.');
         console.log(res);
      },
      error: (err) => {
        this.errorMessage.set(" Erreur lors de l'ajout de la musique.");
        console.log(err);
      }
    });

  };
}
