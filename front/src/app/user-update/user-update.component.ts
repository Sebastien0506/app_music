import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../user/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from "@angular/forms";
import { UserUpdateService } from './user-update.service';
import { UserComponent } from '../user/user.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-update',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './user-update.component.html',
  styleUrl: './user-update.component.css'
})

export class UserUpdateComponent {

  constructor(private userUpdate: UserUpdateService){}
  private dialogRef = inject(MatDialogRef<UserComponent>)

  data = inject<{userData: User}>(MAT_DIALOG_DATA);

  //On récupère les données du formulaire
  usernameInput = this.data.userData.username;
  last_nameInput = this.data.userData.last_name;
  emailInput = this.data.userData.email;
  errorMessage = signal('');
  succesMessage = signal('');
  //On crée la fonction pour valider les données
  verifyInput(): boolean {

    //On met les données du formulaire dans des variables
    const username = this.usernameInput;
    const last_name = this.last_nameInput;
    const email = this.emailInput;
    console.log(email, username, last_name);
    if (
      username.trim() === '' ||
      last_name.trim() === '' ||
      email.trim() === ''
    ) {
      this.errorMessage.set('Un champs est manquant.');
      return false;
    }

    //On vérifie que les données sont bien de type string
    if(typeof username !== 'string' || typeof last_name !== 'string' || typeof email !== 'string' ) {
      this.errorMessage.set('Un champs n\'est pas de type chaine de caractère.');
      return false
    };

    //Vérifie que le username contient bien des caractères autoriser
    for (let i = 0; i < username.length ; i++) {
      const code = username.charCodeAt(i);
      if (
        !(code >= 97 && code <= 122) && //a - z
        !(code >= 65 && code <= 90) && // A - Z
        !(code >= 192 && code <= 376) && // À - Ÿ
        code != 45 // -
      ) {
        this.errorMessage.set("Le champs 'Nom' contient des caractère non autorisé");
        return false;
      }
    }

    //On vérifie le champ last_name
    for (let i = 0; i < last_name.length; i++) {
      const code = last_name.charCodeAt(i);
      if (
        !(code >= 97 && code <= 122) && //a - z
        !(code >= 65 && code <= 90) && // A - Z
        !(code >= 192 && code <= 376) && // À - Ÿ
        code != 45 // -
      ) {
        this.errorMessage.set("Le champ 'Prénom' contient des caractère non autorisé");
        return false;
      }
    }

    //On vérifie que l'email contient un @ et un point.
    if(!email.includes('@') || !email.includes('.')) {
      this.errorMessage.set("L'email est incorrect.");
      return false;
    }

    // On vérifie les caractères du champ email
    for (let i = 0; i < email.length; i++) {
      const code = email.charCodeAt(i);

      if (
        !(code >= 97 && code <= 122) && // a - z
        !(code >= 65 && code <= 90) &&  // A - Z
        !(code >= 48 && code <= 57) &&  // 0 - 9
        !(code >= 192 && code <= 376) && // caractères Unicode de cette plage
        code !== 45 && // -
        code !== 64 && // @
        code !== 46 && // .
        code !== 95    // _
      ) {
        this.errorMessage.set(
          "Le champ 'Email' contient des caractères non autorisés."
        );

        return false;
      }
    }
    return true;
  }

  //On envoi la requête
  sendRequest(){
    //On vérifie que les données sont correct
    const validatedData = this.verifyInput();

    if (!validatedData){
      this.errorMessage.set('Un champs est incorrect.');
      return
    };

    //On crée la variable data pour stocker les données
    const data = {
      //On stock les données de l'utilisateur
      username: this.usernameInput,
      last_name: this.last_nameInput,
      email: this.emailInput,
    };
    console.log(data);

    this.userUpdate.sendRequestUpdateUser(data).subscribe({
      next: () => {
          this.dialogRef.close({
            success: true,
            message: "L'utilisateur a été modifié avec succès.",
            user: data
          });

      },
      error: (err) => {
        this.errorMessage.set(err);
      },
    });


  }
}
