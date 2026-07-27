import { Component, inject, OnInit, signal } from '@angular/core';
import { UserComponent } from '../user/user.component';
import { AuthServiceService } from '../auth-service.service';
import { LoginComponent } from '../login/login.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule, MatButton } from '@angular/material/button';
import { RegisterComponent } from '../register/register.component';
import { LoggedService } from '../logged.service';
import { DialogRef } from '@angular/cdk/dialog';
import { NavBarService } from './nav-bar.service';



@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatButton],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})

export class NavBarComponent implements OnInit{

  constructor(private authservice: AuthServiceService, private dialog: MatDialog, private navBarService: NavBarService) {}
  
  private loggedService = inject(LoggedService);

  isLogged = this.loggedService.isLogged;

  successMessage = signal('');

  ngOnInit(): void {
      this.loggedService.checkLogin();
  }
  
  logout() {
    this.navBarService.logoutUser().subscribe({
      next: (res) => {
        this.loggedService.userLogout();
        this.successMessage.set('Utilisateur déconnecter avec succès.');
        console.log(res);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  ouvrirFormulaireLogin(){
    this.dialog.open(LoginComponent, {
      height: '700px',
      width: '700px'
    });
  }

  ouvrirFormulaireRegister(){
    this.dialog.open(RegisterComponent, {
      height: '700px',
      width: '700px',
    });
    
  }
  
  
}
