import { Component, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CreateCategoryService } from './create-category.service';


@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatButtonModule, FormsModule],
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.css'
})
export class CreateCategoryComponent {

  constructor(private createCategoryService: CreateCategoryService){}
  nameInput = signal('');
  errorMessage = signal('');
  successMessage = signal('');

  verifyInput(): boolean {
     const nameCategory = this.nameInput();

     if (!nameCategory) {
        this.errorMessage.set("Le champ 'Nom' est vide.");
        return false;
     }

     //On défini les caractères autorisé.
     for (let i = 0; i < nameCategory.length ; i++) {
      const code = nameCategory.charCodeAt(i);
      if(
        !(code >= 48 && code <= 57) && // 0-9
        !(code >= 65 && code <= 90) && // A - Z
        !(code >= 97 && code <= 122) && // a - z
        !(code >= 192 && code <= 376) && // À - Ÿ
        code !== 45 && // -
        code !== 32 // espace
      ){
        this.errorMessage.set("Le champ 'Nom' contient des caractères non autorisé.");
        return false;
      }
     }

     return true;
  }

  sendRequest(): void {
    //On n'appelle la fonction verifyInput()
    const validatedInput = this.verifyInput();

    if(!validatedInput){
      this.errorMessage.set('Le champ est invalide.');
      return;
    }

    const data = {
       "name": this.nameInput(),
    };

    this.createCategoryService.sendRequestCreateCategory(data).subscribe({
      next: (res) => {
        this.successMessage.set('Catégorie crée avec succès.');
        console.log(res);
      },
      error: (err) => {
        this.errorMessage.set("Erreur lors de la création de la catégorie.");
        console.error(err);
      }
    });


  }

}
