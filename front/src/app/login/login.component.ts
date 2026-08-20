import { Component, signal, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ConnexionService } from './connexion.service';
import { AuthServiceService } from '../auth-service.service';
import { LoggedService } from '../logged.service';
import { Router, RouterLink } from '@angular/router';
import { MatButton } from "@angular/material/button";
import { MatSnackBar } from '@angular/material/snack-bar';
  
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatDialogContent, MatInputModule, FormsModule, MatButton, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  constructor(private connexionService: ConnexionService, private authService: AuthServiceService, private logedService: LoggedService, private router: Router){}
  private dialogRef = inject(MatDialogRef<LoginComponent>);

  private snackBar = inject(MatSnackBar);
  
  ngOnInit(): void {
      this.authService.getCsrfToken().subscribe({
        next: (res) => {
          console.log("CSRF récupérer")
          
        },
        error: (err) => {
          console.error(err);
        }
      })
  }
  //On récupère les données du formulaire
  emailInput = signal('');
  passwordInput = signal('');

  //On déclare une variable errorMessage
  errorMessage = signal('');
  successMessage = signal('');

  
  
  //On crée une fonction qui vérifie les champs
  verifyInput(): boolean {

    //On vérifie que les champs contient quelque chose
    if(this.emailInput().trim() === '' || this.passwordInput().trim() === ''){
      // Si un champs est vide on renvoie un message
      this.errorMessage.set("Veuillez remplir tous les champs.");
      return false;
    }
    this.errorMessage.set(''); 
    console.log(this.emailInput());
    console.log(this.passwordInput());

    const email = this.emailInput()
    const password = this.passwordInput()

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

 
  sendRequest(){
    console.log("test");
    //On appel la fonction verifyInput
    const verifyData = this.verifyInput();
    console.log(verifyData);

    if(!verifyData) {
      this.errorMessage.set('Certain champs sont invalide.');
      return;
    };

    //On stock les données dans la variable data
    const data = {
      email: this.emailInput(),
      password: this.passwordInput()
    };

    //On envoi les données
    this.connexionService.sendRequestLogin(data).subscribe({
      next: (res) => {
        this.logedService.userLogin(res.is_staff);
        console.log('User connected');
        this.dialogRef.close();

      },
      error: (error) => {
        this.errorMessage.set('Erreur lors de la connexion.');
        this.snackBar.open(
          this.errorMessage(),
          'Fermer',
          {
            duration: 3000
          }
        );
        console.error('Erreur lors de la connexion :', error);
      }
    });


  }

  redirectToFormsResetPassword():void {
    
    this.dialogRef.close('reset-password');
  }
  

}
