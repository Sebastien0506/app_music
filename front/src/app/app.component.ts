import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { LoggedService } from './logged.service';
import { AuthServiceService } from './auth-service.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'front';

  constructor(private loggedService: LoggedService, private authService: AuthServiceService){}

  ngOnInit(): void {
      this.authService.getCsrfToken().subscribe({
        next: () => {
          this.loggedService.checkLogin();
        },
        error: (err) => {
          console.error(err);
        }
      });
  }


}
