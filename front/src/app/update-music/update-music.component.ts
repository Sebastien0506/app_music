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
    const verifydata = this.verifyInput();
    console.log(verifydata);
    if(!verifydata) {
      this.errorMessage.set("un champ est manquant.");
      return;
    }

    //On vérifie qu'une catégorie est été sélectionné
    if (this.selectedCategoryIds.length === 0) {
      this.errorMessage.set("Aucune catégorie n'a été sélectionnée.");
      return;
    }
    const data = {
      title: this.titleInput(),
      category_ids: this.selectedCategoryIds
    };
    console.log(data);
    //On envoie la requête
    this.updateMusicService.updateMusic(id, data).subscribe({
        next: (res) => {
          this.successMessage.set("La musique à bien été mis a jour.");
          console.log(res);
        },
        error: (err) => {
          console.error(err);
        }
    });
  }
}
