import { Component, signal, computed } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { max } from 'rxjs';
import { AddMusicService, Category } from './add-music.service';
import { MatCheckboxModule } from '@angular/material/checkbox';


@Component({
  selector: 'app-add-music',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatCheckboxModule],
  templateUrl: './add-music.component.html',
  styleUrl: './add-music.component.css'
})
export class AddMusicComponent {

  constructor(private addMusicService: AddMusicService, private getCategory: AddMusicService){}

  

  category: Category[] = [];
  //On récupère l'id des categories séléctionner
  selectedCategoryId: number [] = [];
  //On déclare la variable qui va être utilisé pour stocker l'image de la musique
  selectedImageFile: File | null = null; 
  
  errorMessage = signal('');
  successMessage = signal('');
  ngOnInit(){
     this.getCategory.getCategory().subscribe({
      next: (data) => {
        this.category = data;
        
      },
      error: (err) => {
        this.errorMessage.set('Les catégories n\'ont pas pu être récupérer.');
        console.error(err);
      }
     });
  }
  
  //On fait la fonction qui permet de renseigner l'image
  onSelectedImageFile(event: Event) {
    //On récupère le fichier dans le html
    const input = event.target as HTMLInputElement;

    //On vérifie le fichier
    if (input.files && input.files.length > 0) {
      //On set le fichier à selectedImageFile
      this.selectedImageFile = input.files[0];

      console.log(this.selectedImageFile);
    }
  }
  
  onCheckBoxValidate(event: Event): void {
    console.log('fonction appelée.');
    //On récupère l'évènement dans le html
    const checkboxInput = event.target as HTMLInputElement;
    const categoryId = Number(checkboxInput.value);
    //On vérifie qu'une checkbox est été sélectionner
    if (checkboxInput.checked){
      this.selectedCategoryId.push(categoryId)
    }else{
      this.selectedCategoryId = this.selectedCategoryId.filter(
        id => id !== categoryId
      );
    }
  }
   
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
    console.log("Fonction verifyFile appelée");
    //Si aucun fichier on envoi un message d'erreur
    if(!this.selectedFile) {
      
      this.errorMessage.set('Aucun fichier sélectionné.');
      return false
    }
    console.log("Nom de la musique:", this.selectedFile);
    //Si aucune image n'est sélectionner on renvoi un messsage d'erreur
    if(!this.selectedImageFile){
      this.errorMessage.set("Aucune image sélectionné.");
      return false;
    }
    console.log("Nom de l'image:", this.selectedImageFile);
    //On récupère le nom du fichier
    const filename = this.selectedFile.name

    //On récupère le nom avant l'extension
    const nameWithoutExtension = filename.substring(0, filename.lastIndexOf("."));
    //Si aucun nom trouvé on retourne une erreur
    if (!nameWithoutExtension){
      this.errorMessage.set("Le nom de fichier est invalide.");
      return false;
    }
    const normalizedName = filename.normalize("NFC");
    //ON fait le regex pour vérifie le nom du fichier audio
    const regexAudioFile = /^[\p{L}\p{N}._ '’-]+$/u;

    //On vérifi si le nom de l'audio ne contient pas de caractères non autorisée.
    if(!regexAudioFile.test(normalizedName)){
      console.log("Resultat du test pour le nom de l'audio");
      this.errorMessage.set("Le nom de la musique contient des caractères non autorisée.");
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

    //CODE POUR VÉRIFIE L'IMAGE 
    //On récupère le nom du fichier
    const imageFile = this.selectedImageFile;

    //On vérifie la taille du fichier
    const maxSizeImage = 20 * 1024 * 1024;
    if (imageFile.size > maxSizeImage) {
      this.errorMessage.set("L'image est trop volumineux.");
      return false;
    }

    //On récupère le nom du fichier
    const imageFilename = this.selectedImageFile.name
    //On récupère son nom avant l'extension
    const nameImageWithoutExtension = imageFilename.substring(0, imageFilename.lastIndexOf("."));
    //Si aucun nom est trouvée on renvoi un message d'erreur
    if(!nameImageWithoutExtension) {
      this.errorMessage.set("L'image n'a pas de nom");
      return false;
    }

    //On normalize le nom de l'image 
    const normalizedImageName = imageFilename.normalize("NFC");
    //On vérifie si nom ne contient pas des caractère non autorisée.
    const regexImage = /^[\p{L}\p{N}._ '’-]+$/u;

    //On vérifie que le nom correspond
    if(!regexImage.test(normalizedImageName)){
      this.errorMessage.set("Le nom de l'image contient des caractères non autorisée.");
      return false;
    }


    //on définit les types autorisée.
    const allowedTypeImages = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp"
    ]

    //On vérifie que le type est bien autorisée
    if(!allowedTypeImages.includes(imageFile.type)){
        this.errorMessage.set("Le type de l'image n'est pas autorisé.");
        return false;
    }

    //On récupère l'extension du fichier
    const extensionImage = this.selectedImageFile.name.split(".").pop()?.toLocaleLowerCase();

    //On définit les types autorisée
    const allowedExtensionImage = [
      "jpeg",
      "png",
      "jpg",
      "webp"
    ]

    if(!allowedExtensionImage.includes(extensionImage ?? "")){
      this.errorMessage.set("L'extension de l'image n'est pas autorisée.");
      return false;
    }


    return true

    
  }

  //On envoi la requête
  sendRequest(): void {
    console.log('fonction sendRequest appelée.');

    //On vérifie le fichier
    if(!this.verifyFile()){
      return;
    }
    console.log(this.verifyFile());
    
    //On vérifie que selectedId n'est pas null
    if (this.selectedCategoryId === null) {
      this.errorMessage.set('Aucune catégorie sélectionnée.');
      return;
    }
    console.log(this.verifyFile());
    //On déclare la variable forData
    const formData = new FormData;
    //On lui met le fichier
    formData.append("music", this.selectedFile!);
    //On donne à formData l'image
    formData.append("image", this.selectedImageFile!);
    //Pour chaque catégorie on ajoute son id
    for (const categoryId of this.selectedCategoryId) {
      formData.append(
        'category_id', categoryId.toString()
      )
    }
    
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
