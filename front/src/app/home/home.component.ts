import { Component, inject, signal } from '@angular/core';
import { AvatarResponse, Description, HomeService } from './home.service';
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

  //On initialise la variable description avec la reponse que l'on attend
  description : Description | null = null;
  //On fait la requête au chargement de la page
  ngOnInit(): void {
    //On fait la requête pour récupérer l'avatar du site
    this.homeService.get_avatar().subscribe({
      next: (data) => {
        this.avatar = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
    //On fait la requête pour récupérer la description du site
    this.homeService.get_description().subscribe({
      next: (data) => {
        this.description = data;
        console.log(this.description);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

}
