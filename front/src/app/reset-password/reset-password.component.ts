import { Component, signal, OnInit, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { ResetPasswordService } from './reset-password.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// import { ɵEmptyOutletComponent } from "@angular/router";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatCardModule, MatButton, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit{
  private readonly route = inject(ActivatedRoute);
  constructor(private resetPasswordService: ResetPasswordService, private router: Router) {}

  token: string | null = null;

  ngOnInit(): void {
      this.token = this.route.snapshot.queryParamMap.get('token');

      if(!this.token) {
        this.errorMessage.set('Le lien de réinitialisation est invalide.');
      }
  }
  errorMessage = signal('');

  newPassword = signal('');
  confirmNewPassword = signal('');

  verifyPassword(): boolean {
    const newPassword = this.newPassword();
    const confirmPassword = this.confirmNewPassword();
  
    this.errorMessage.set('');
  
    // Vérification du type
    if (
      typeof newPassword !== 'string' ||
      typeof confirmPassword !== 'string'
    ) {
      this.errorMessage.set('Le mot de passe doit être une chaîne de caractères.');
      return false;
    }
  
    // Vérification de la longueur
    if (newPassword.length < 6 || confirmPassword.length < 6) {
      this.errorMessage.set(
        'Le mot de passe doit contenir au moins 6 caractères.'
      );
      return false;
    }
  
    // Vérification que les deux champs sont identiques
    if (newPassword !== confirmPassword) {
      this.errorMessage.set(
        'Le mot de passe doit être identique dans les deux champs.'
      );
      return false;
    }
  
    let contientChiffre = false;
    let contientCaractereSpecial = false;
  
    for (let i = 0; i < newPassword.length; i++) {
      const code = newPassword.charCodeAt(i);
  
      if (code >= 48 && code <= 57) {
        contientChiffre = true;
      }
  
      if (
        code === 35 ||
        code === 36 ||
        code === 37 ||
        code === 64
      ) {
        contientCaractereSpecial = true;
      }
  
      const caractereAutorise =
        (code >= 48 && code <= 57) ||
        (code >= 65 && code <= 90) ||
        (code >= 97 && code <= 122) ||
        code === 35 ||
        code === 36 ||
        code === 37 ||
        code === 64;
  
      if (!caractereAutorise) {
        this.errorMessage.set(
          'Le mot de passe contient un caractère non autorisé.'
        );
        return false;
      }
    }
  
    if (!contientChiffre) {
      this.errorMessage.set(
        'Le mot de passe doit contenir au moins un chiffre.'
      );
      return false;
    }
  
    if (!contientCaractereSpecial) {
      this.errorMessage.set(
        'Le mot de passe doit contenir au moins un caractère spécial : #, $, % ou @.'
      );
      return false;
    }
  
    return true;
  }


  submitResetPassword(): void {
    const passwordValid = this.verifyPassword();
  
    console.log('Fonction appelée');
    console.log('Mot de passe valide :', passwordValid);
    console.log('Token :', this.token);
    console.log('Nouveau mot de passe :', this.newPassword());
  
    if (!passwordValid) {
      console.log('Blocage : mot de passe invalide');
      return;
    }
  
    if (!this.token) {
      console.log('Blocage : token absent');
      this.errorMessage.set('Le token est absent.');
      return;
    }
  
    const data = {
      token: this.token,
      password: this.newPassword(),
    };
  
    console.log('Données envoyées :', data);
  
    this.resetPasswordService.resetPassword(data).subscribe({
      next: (response) => {
        console.log('Succès :', response);
        this.errorMessage.set('Le mot de passe a bien été modifié.');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Erreur :', error);
        this.errorMessage.set('Le lien est invalide ou a expiré.');
      },
      complete: () => {
        console.log('Requête terminée');
      }
    });
  }
}
