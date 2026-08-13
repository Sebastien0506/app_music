import { Component, signal } from '@angular/core';
import { AllMusic, GetAllMusicService } from './get-all-music.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { LoggedService } from '../logged.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-get-all-music',
  standalone: true,
  imports: [MatTableModule, MatButtonModule],
  templateUrl: './get-all-music.component.html',
  styleUrl: './get-all-music.component.css'
})
export class GetAllMusicComponent {

  displayedColumns: string[] = ['title', 'duration', 'category', 'actions'];

  constructor(private getAllMusic: GetAllMusicService, private loggedService: LoggedService, private router: Router){}
  //on initialise la varaible AllMusic a un tableau vide 
  AllMusic : AllMusic[] = [];
  user = signal<Boolean>(false);
  //Au chargement de la page on fait la requête
  ngOnInit(){
     this.getAllMusic.getAllMusic().subscribe({
      next: (data) => {
        this.AllMusic = data;
        console.log(this.AllMusic);
        // const user = this.loggedService.isStaff();
        this.user.set(this.loggedService.isStaff());
        console.log(this.user);
      },
      error: (err) => {
        console.error(err);
      }
     });
  }

  viewMusic(id: number){
    this.router.navigate(['/info_music', id]);
  }

  // //On crée la fonction pour supprimer une musique
  // deleteMusic(id: number) {
  //   this.infoMusic.deleteMusic(id).subscribe({
  //     next: (res) => {
  //       this.deleteMessage.set(res);
  //       this.music = this.music.filter(
  //         music => music.id !== id
  //       );
  //     },
  //     error: (err) => {
  //       this.errorMessage.set("Erreur lors de suppression");
  //     }
  //   });
  // }

}
