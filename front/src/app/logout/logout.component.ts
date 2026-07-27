import { Component } from '@angular/core';
import { LogoutService } from './logout.service';
import { LoggedService } from '../logged.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {

  constructor(private logoutService: LogoutService, private loggedService: LoggedService){}

  //On crée la fonction qui permet de se déconnecter
  logout(): void {
    this.logoutService.logoutUser().subscribe({
      next: (res) => {
        console.log(res);
        this.loggedService.userLogout();

      },
      error: (err) => {
        console.log(err);
      }
    })

  }

}
