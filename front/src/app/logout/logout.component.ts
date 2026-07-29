import { Component } from '@angular/core';
import { LogoutService } from './logout.service';
import { LoggedService } from '../logged.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {

  constructor(private logoutService: LogoutService, private loggedService: LoggedService, private router: Router){}

  //On crée la fonction qui permet de se déconnecter
  logout(): void {
    this.logoutService.logoutUser().subscribe({
      next: (res) => {
        console.log(res);
        this.loggedService.userLogout();
        this.router.navigate(['/']);

      },
      error: (err) => {
        console.log(err);
      }
    })

  }

}
