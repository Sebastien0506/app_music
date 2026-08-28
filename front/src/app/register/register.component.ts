import { Component, signal, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDialogContent } from '@angular/material/dialog';
import { RegisterService } from './register.service';
import { LoggedService } from '../logged.service';
import { AuthServiceService } from '../auth-service.service';
import { MatButton } from "@angular/material/button";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatDialogContent, MatButton],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  constructor(private registerService: RegisterService, private logedService: LoggedService, private authService: AuthServiceService){}

  ngOnInit(): void {
      this.authService.getCsrfToken().subscribe({
        next: (res) => {
          console.log("Jeton CSRF récuperer");
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  //On récupère les données du formulaire
  usernameInput = signal('');
  last_nameInput = signal('');
  emailInput = signal('');
  passwordInput = signal('');

  //On déclare une variable errorMessage pour les messages d'erreur
  errorMessage = signal('');

  //On crée un fonction qui vérifie les données
  verifyInput(): boolean {
    
    //On vérifie que les champs ne sont pas vide 
    if(
      this.emailInput().trim() == '' ||
      this.usernameInput().trim() =='' ||
      this.last_nameInput().trim() == '' ||
      this.passwordInput().trim() == '' 
    ) {
      this.errorMessage.set('Veuillez remplir tous les champs.');
      return false;
    }
    this.errorMessage.set('');

    //On stock les données dans des variable
    const username = this.usernameInput();
    const last_name = this.last_nameInput();
    const email = this.emailInput();
    const password = this.passwordInput();

    //On vérifie que les champs username, last_name et email sont bien des string
    if (typeof username !== "string" || typeof last_name !== "string" || typeof email != 'string'){
      return false;
    }

    //On vérifie que l'email contient un '@' et un point
    if(!email.includes('@') || !email.includes('.')) {
      return false;
    }

    //On vérifie que le champs username ne comporte pas de caractères non autoriser
    for (let i = 0; i < username.length; i++){
      const code = username.charCodeAt(i);
      if(
        !(code >= 65 && code <= 90) && //A - Z
        !(code >= 97 && code <= 122) && // a - z
        code != 45
      ) {
        this.errorMessage.set("Le champs 'Nom' contient des caractères invalide.")
        return false;
      }
    }

    // On vérifie que le champs last_name ne contient pas des caractère invalides.
    for (let i = 0; i < last_name.length; i++) {
      const  code = last_name.charCodeAt(i);
      if(
        !(code >= 65 && code <= 90) &&
        !(code >= 97 && code <= 122) &&
        code != 65
      ) {
        this.errorMessage.set("le champs 'Prénom' contient des caractères invalides.");
        return false;
      }
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
    // Verification du mot de passe
    if (typeof password !== 'string' || password.length < 6) {
      return false;
    };
    // On initialise les variables pour les caractères spéciaux
    let contientChiffre = false;
    let contientCaractereSpecial = false;

    for (let i = 0; i < password.length; i++) {
      const code = password.charCodeAt(i);

      if ( code >= 48 && code <= 57) {
        contientChiffre = true;
      }

      //On renseigne les caractères spéciaux que l'on veut
      if (code == 35 || code == 36 || code == 37 || code == 64){
        contientCaractereSpecial = true;
      }

      if (
        !(code >= 48 && code <= 57) &&
        !(code >= 65 && code <= 90) &&
        !(code >= 97 && code <= 122) &&
        code !== 35 && code !== 36 && code !== 37 && code !== 64
      ){
        return false;
      }
    }

    if(!contientChiffre || !contientCaractereSpecial){
      return false;
    }

    return true;
  }

  sendRequestRegister(){
    console.log('Passe dans le requête.');
    //On appel la fonction verifyInput
    const verifyData = this.verifyInput();
    console.log(verifyData);

    //On vérifie qu'elle soit valide
    if(!verifyData){
      this.errorMessage.set('Certains champs ne sont pas valide.');
      return;
    }

    //On stock les données dans la variable data
    const data = {
      username: this.usernameInput(),
      last_name: this.last_nameInput(),
      email: this.emailInput(),
      password: this.passwordInput()
    }

    //On envoie la requête
    this.registerService.requestRegister(data).subscribe({
      next: (res) => {
        //On utilise this.logedService.userLogin() pour mettre la variable isLogged a true
        this.logedService.userLogin(res.is_staff);
        console.log('User created')
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}
