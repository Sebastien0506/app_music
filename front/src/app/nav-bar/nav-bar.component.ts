import { Component, OnInit } from '@angular/core';
import { UserComponent } from '../user/user.component';
import { AuthServiceService } from '../auth-service.service';


@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})

export class NavBarComponent implements OnInit {

  constructor(private authservice: AuthServiceService) {}
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
}
