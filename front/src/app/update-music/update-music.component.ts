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

@Component({
  selector: 'app-update-music',
  standalone: true,
  imports: [MatFormFieldModule, MatInput, MatButtonModule, FormsModule],
  templateUrl: './update-music.component.html',
  styleUrl: './update-music.component.css'
})
export class UpdateMusicComponent {

  constructor(private updateMusicService: UpdateMusicService){}

  private dialogRef = inject(MatDialogRef<InfoMusicComponent>);

  
  isChecked: boolean = false;

  data = inject<{dataMusic: Music}>(MAT_DIALOG_DATA);
  allCategory: Category[] = [];
  //On déclare les variable pour récuperer les données
  titleInput = signal('');
  errorMessage = signal('');
  successMessage = signal('');
  selectedCategoryId: number | null = null;
  ngOnInit(){
    this.updateMusicService.getCategory().subscribe({
      next: (data) => {
         this.allCategory = data;
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
    // console.log(titleMusic);
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
      //on récupère l'évènement dans le html
      const checkBoxInput = event.target as HTMLInputElement;

      //on vérifie qu'une checkbox est été sélectionner
      if(!checkBoxInput.checked) {
         this.selectedCategoryId = null;
         this.errorMessage.set('Aucune catégorie n\'a été sélectionner.');
         return;
      }
      this.selectedCategoryId = Number(checkBoxInput.value);
  }

  sendRequest(id: number): void {

    //on vérifie les données
    const verifydata = this.verifyInput();

    if(!verifydata) {
      this.errorMessage.set("un champ est manquant.");
      return;
    }

    //On vérifie qu'une catégorie est été sélectionné
    if(this.selectedCategoryId){
      this.errorMessage.set("Aucune catégorie n'a été sélectionnée.");
      return;
    }
    const data = {
      title: this.titleInput(),
      category_id: this.selectedCategoryId
    };
    //On envoie la requête
    this.updateMusicService.updateMusic(this.data.dataMusic.id, data).subscribe({
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
