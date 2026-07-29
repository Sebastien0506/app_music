import { Component, signal } from '@angular/core';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
// import { ɵEmptyOutletComponent } from "@angular/router";
import { MatCardModule } from '@angular/material/card';
import { FormsResetPasswordService } from './forms-reset-password.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-forms-reset-password',
  standalone: true,
  imports: [MatFormFieldModule, MatButtonModule, MatInputModule, MatCardModule, FormsModule],
  templateUrl: './forms-reset-password.component.html',
  styleUrl: './forms-reset-password.component.css'
})
export class FormsResetPasswordComponent {

  constructor(private formsResetPassword: FormsResetPasswordService){}

  emailInput = signal('');
  errorMessage = signal('');
  successMessage = signal('');

   //On crée une fonction qui vérifie les champs
   verifyInput(): boolean {

    //On vérifie que les champs contient quelque chose
    if(this.emailInput().trim() === ''){
      // Si un champs est vide on renvoie un message
      this.errorMessage.set("Veuillez remplir tous les champs.");
      return false;
    }
    this.errorMessage.set(''); 
    console.log(this.emailInput());

    const email = this.emailInput()
    

    //On vérifie que le champ email est bien une string.
    if(typeof email != 'string') {
      return false;
    }

    //On vérifie que l'email contient un @ et un point.
    if(!email.includes('@') || !email.includes('.')){
      return false;
    }

    //On vérifie que chaque caractère est autorisé.
    for (let i = 0; i < email.length; i++) {
      const code = email.charCodeAt(i);
      if(
        !(code >= 48 && code <= 57) && //0-9
        !(code >= 65 && code <= 90) && //A-Z
        !(code >= 97 && code <= 122) && // a-z
        code !== 95 && // _
        code !== 64 && // @
        code !== 46 // .
      ) {
        return false;
      }
    }
    return true;
  }
  resetPassword(){
    //On vérifie que l'email est valide
    const validateEmail = this.verifyInput();

    //Si aucun email
    if(!validateEmail){
      this.errorMessage.set('Email incorrect.');
    }
    
    //On stock l'email dans la variable data
    const data = {
      email: this.emailInput()
    }
    //On envoi l'email
    this.formsResetPassword.requestResetPassword(data).subscribe({
        next:(response) => {
            this.successMessage.set('Un email vous a été envoyer.');
        },
        error: (err) => {
          console.error(err);
        }
    })
  }
}
