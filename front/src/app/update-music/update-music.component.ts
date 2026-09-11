import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { InfoMusicComponent } from '../info-music/info-music.component';
import { Music } from '../info-music/info-music.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from "@angular/material/input";
import { Category, UpdateMusicService } from './update-music.service';
import { MatButtonModule } from "@angular/material/button";
import { FormsModule } from '@angular/forms';
import { GetAllMusicComponent } from '../get-all-music/get-all-music.component';

@Component({
  selector: 'app-update-music',
  standalone: true,
  imports: [MatFormFieldModule, MatInput, MatButtonModule, FormsModule],
  templateUrl: './update-music.component.html',
  styleUrl: './update-music.component.css'
})
export class UpdateMusicComponent {

  constructor(private updateMusicService: UpdateMusicService){}

  private dialogRef = inject(MatDialogRef<GetAllMusicComponent>);

  
  isChecked: boolean = false;

  data = inject<{dataMusic: Music}>(MAT_DIALOG_DATA);
  allCategory: Category[] = [];
  //On déclare les variable pour récuperer les données
  titleInput = signal('');
  errorMessage = signal('');
  successMessage = signal('');
  selectedCategoryIds: number[] = [];
  //On déclare la variable our sélectionner le fichier
  selectedFile: File | null = null;

  ngOnInit(){
    this.updateMusicService.getCategory().subscribe({
      next: (data) => {
         this.allCategory = data;
         this.titleInput.set(this.data.dataMusic.title);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onFileSelected(event: Event) {
    //On récupère le fichier depuis le navigateur
    const input  = event.target as HTMLInputElement;

    //On vérifie si le fichier n'est pas vide
    if(input.files && input.files.length > 0) {
      //On donne à selectedFile le fichier
      this.selectedFile = input.files[0];

      console.log(this.selectedFile);
    }
  }

  //On vérifie les données
  verifyInput(): boolean {
    //On récupère le titre dans le formulaire
    const titleMusic = this.titleInput();

    console.log(titleMusic);
    //Si aucun titre on renvoie un message d'erreur
    if(!titleMusic) {
     this.errorMessage.set('Aucun titrre n\'est renseigner.');
     return false;
    }

    //On vérifie si le titre est une chaine de caractère
    if(typeof titleMusic !== 'string'){
      this.errorMessage.set('Le titre doit être une chaine de caractères.');
      return false;
    }

    //On vérifie que le titre contient uniquement des caractères autorisé.
    for(let i = 0; i < titleMusic.length; i++) {
      const code = titleMusic.charCodeAt(i);
      
      if (
        !(code >= 97 && code <= 122) && //a - z
        !(code >= 65 && code <= 90) && // A - Z
        !(code >= 192 && code <= 376) && // À - Ÿ
        !(code >= 48 && code <= 57) && // 0 - 9
        code != 45 &&// -
        code != 32 // espace 

      ) {
        this.errorMessage.set("Le champs 'Titre' contient des caractère non autorisé");
        return false;
      }
      
    }

    //CODE POUR VÉRIFIER L'IMAGE
    if(!this.selectedFile){
      this.errorMessage.set("Aucune image sélectionner.");
      return false
    }

    //On récupère le nom du fichier
    const filename = this.selectedFile.name;

    //On récupere le nom avant le point
    const nameWithoutExtension = filename.substring(0, filename.lastIndexOf("."));

    const normalizedName = nameWithoutExtension.normalize("NFC");
    console.log("Nom normalizer :", normalizedName);
    //On vérifie qu'il est bien un nom
    if (!nameWithoutExtension){
      this.errorMessage.set("L'image n'a pas de nom");
      return false;
    }
    console.log("Nom de l'image: ", nameWithoutExtension);

   //On définit le regex pour les caractère autorisée.
   const imageRegex = /^[\p{L}\p{N}._ '’-]+$/u;
  

   //Si le nom de l'image ne match pas avec le regex on renvoi un message d'erreur
   if(!imageRegex.test(normalizedName)){
    this.errorMessage.set("Le nom du fichier contient des caractères non autorisée.");
    console.log('test regex');
    return false;
   }

    //On déclare les format autorisée.
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp"
    ];
   console.log("type accepter : ", allowedTypes);
    //On vérifie si le type de fichier est bien autorisée.
    if(!allowedTypes.includes(this.selectedFile.type)){
      console.log('test type mimes');
      console.log("ERROR MIMES : ", this.selectedFile.type);

      this.errorMessage.set("Le type de fichier n'est pas autorisée.");
      return false;
    }


    //On vérifie la taille du fichier
    const maxSize = 20 * 1024 * 1024;
    if(this.selectedFile.size > maxSize){
      console.log("test max size");
      console.log(this.selectedFile.size);

      this.errorMessage.set("Le fichier est trop volumineux.");
      return false;
    }


    //On récupère l'extension du fichier
    const extension = this.selectedFile.name.split(".").pop()?.toLowerCase();
    console.log("test extension");
    console.log("EXTENSION :", extension);

    //On définit les extension autorisée
    const allowedExtensions = [
      "jpeg",
      "png",
      "jpg",
      "webp",
    ];

    //On vérifie que le fichier contient une extension
    if(!allowedExtensions.includes(extension ?? "")){
      console.log("test extension fichier", extension);
      this.errorMessage.set("L'extension du fichier n'est pas autorisée.");
      return false;
    }


   return true
  }

//On vérifie qu'une catégorie à bien été sélectionner
  onCheckBoxValidate(event: Event): void {
      //On récupère l'identifiant des checkbox 
      const checkboxInput = event.target as HTMLInputElement;
      const categoryId = Number(checkboxInput.value);

      if (checkboxInput.checked) {
        this.selectedCategoryIds.push(categoryId);
      } else {
        this.selectedCategoryIds = this.selectedCategoryIds.filter(
          id => id !== categoryId
        );
      }
      console.log(this.selectedCategoryIds);
  }

  sendRequest(id: number): void {
    console.log('fonction appelée.');
    //on vérifie les données
    const verifyData = this.verifyInput();

    console.log("Résultat verifyInput :", verifyData);

    if(!verifyData) {
      return;
    }
    
    //On vérifie qu'une catégorie est été sélectionné
    if (this.selectedCategoryIds.length === 0) {
      this.errorMessage.set("Aucune catégorie n'a été sélectionnée.");
      return;
    }
    

    //On déclare formData
    const formData = new FormData;
    //On donne a formData les données
    formData.append('image', this.selectedFile!);
    formData.append('title', this.titleInput());

    for (const categoryId of this.selectedCategoryIds){
      formData.append('category_ids', categoryId.toString())
    }

    //On envoie la requête
    this.updateMusicService.updateMusic(id, formData).subscribe({
        next: (res) => {
          this.successMessage.set("La musique à bien été mis a jour.");
          console.log(res);
        },
        error: (err) => {
          console.error("Status:", err.status);
          console.error(" ERREUR BACK: ", err.error);
          console.error(err);
        }
    });
  }
}
