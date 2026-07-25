import { Component, OnInit } from '@angular/core';
import { UserComponent } from '../user/user.component';
import { AuthServiceService } from '../auth-service.service';
import { LoginComponent } from '../login/login.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule, MatButton } from '@angular/material/button';


@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatButton],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})

export class NavBarComponent implements OnInit {

  constructor(private authservice: AuthServiceService, private dialog: MatDialog) {}
  //On déclare isLogged a false
  isLogged = false
  // Au chargement de la page on fait la requête
  ngOnInit(): void {
    this.authservice.getUser().subscribe({
      next: (user) => {
        this.isLogged = true;
        console.log(user);
      },
      error: (err) => {
        this.isLogged = false;
        console.log(err);
      }
    });
      
  }
  ouvrirFormulaireLogin(){
    this.dialog.open(LoginComponent, {
      height: '700px',
      width: '700px'
    });
  }
  
  
}
