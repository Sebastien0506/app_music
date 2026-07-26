import { Component, inject } from '@angular/core';
import { UserComponent } from '../user/user.component';
import { AuthServiceService } from '../auth-service.service';
import { LoginComponent } from '../login/login.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule, MatButton } from '@angular/material/button';
import { RegisterComponent } from '../register/register.component';
import { LoggedService } from '../logged.service';


@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatButton],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})

export class NavBarComponent {

  constructor(private authservice: AuthServiceService, private dialog: MatDialog) {}
  
  private loggedService = inject(LoggedService);

  isLogged = this.loggedService.isLogged;

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
