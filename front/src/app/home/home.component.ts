import { Component, inject, signal } from '@angular/core';
import { AvatarResponse, HomeService } from './home.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  //On fait le constructeur
  constructor(private homeService: HomeService){}

  //On initialise la variable avatar avec la reponse que l'on attend
  avatar: AvatarResponse | null = null;

  //On fait la requête au chargement de la page
  ngOnInit(): void {
    this.homeService.get_avatar().subscribe({
      next: (data) => {
        this.avatar = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}
