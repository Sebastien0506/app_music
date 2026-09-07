import { Component, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from "@angular/material/button";
import { AddAvatarService } from './add-avatar.service';

@Component({
  selector: 'app-add-avatar',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButton],
  templateUrl: './add-avatar.component.html',
  styleUrl: './add-avatar.component.css'
})
export class AddAvatarComponent {
  constructor(private addAvatarService: AddAvatarService) {}

  //On déclare le fichier sélectionner a null
  selectedFile: File | null = null;

  //On déclare errorMessage
  errorMessage = signal('');

  //On fait l'évènement
  onFileSelected(event: Event){
    //On déclare la variable input et on  lui donne le fichier
    const input = event.target as HTMLInputElement;

    //On vérifie si le fichier est pas vide
    if (input.files && input.files.length > 0) {
      //On donne a selectedFile le fichier 
      this.selectedFile = input.files[0];

      console.log(this.selectedFile);
    }
  }

  //On fait la requête pour vérifier si le fichier est présent et qu'il est valide
  verifyInput(): boolean {
   

    if(!this.selectedFile){
      this.errorMessage.set('Aucun fichier sélectionner.');
      return false;
    }
    //On récupère le nom du fichier
    const filename = this.selectedFile.name
    
    //on récupère le nom du fichier avant l'extention
    const nameWithoutExtension = filename.substring(0, filename.lastIndexOf("."));

    //Si aucun nom trouver on retourne une erreur
    if(!nameWithoutExtension){
      this.errorMessage.set('Aucun nom pour le fichier sélectionné.');
      return false;
    }

    //On vérifie que le nom du fichier contient des caractères autorisé
    for (let i = 0; i < nameWithoutExtension.length; i++) {
        const code = nameWithoutExtension.charCodeAt(i);
        if(
          !(code >= 48 && code <= 57) &&
          !(code >= 65 && code <= 90) &&
          !(code >= 97 && code <= 122) &&
          !(code >= 192 && code <= 376) &&
          code != 45 &&
          code != 32 
        ) {
          this.errorMessage.set("Le nom de l'image contient des caractères non autorisé.");
          return false;
        }
    }

    //On déclare les format autorisé
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/jpg"
    ];

    if(!allowedTypes.includes(this.selectedFile.type)){
      this.errorMessage.set("Le type de fichier n'est pas autorisé.");
      return false;
    }

    //On vérifie la taille du fichier
    const maxSize = 20 * 1024 * 1024;

    if(this.selectedFile.size > maxSize) {
       this.errorMessage.set('Le fichier est trop volumineux');
       return false;
    }

    //On récupère l'extension du fichier
    const extension = this.selectedFile.name.split(".").pop()?.toLowerCase();

    //On définit les extention autorisé
    const allowedExtensions = [
      "jpeg",
      "jpg",
      "png",
      "webp"
    ];

    if(!allowedExtensions.includes(extension ?? "")) {
      this.errorMessage.set("L'extention du fichier n'est pas autorisé.");
      return false;
    }

    return true;
  }

  sendRequest(): void {
    const verifyData = this.verifyInput();

    if(verifyData) {
      console.log("Coucou");
    }
   //on declare la variable formData
    const formData = new FormData();
  //on lui donne le fichier
    formData.append("image", this.selectedFile!);

    //On fait la requête
    this.addAvatarService.sendAvatar(formData).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.error();
      }
    });
  }
}
