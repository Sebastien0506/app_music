import { Component, signal, ViewChild, ElementRef } from '@angular/core';
import { AllMusicFavorites, DisplayFavoriteService } from './display-favorite.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-display-favorite',
  standalone: true,
  imports: [MatTableModule, MatButtonModule],
  templateUrl: './display-favorite.component.html',
  styleUrl: './display-favorite.component.css'
})
export class DisplayFavoriteComponent {

  constructor(private allMusicFavorites: DisplayFavoriteService){}

  displayedColumns: string[] = ['title', 'category', 'duration', 'size', 'actions'];
  musicFavorite: AllMusicFavorites[] = [];
  //On récupère les minutes
  minutes: number = 0;
  //On récupère les secondes
  secondes: number = 0;
  musicFile: string = ('');
  //On récupère la taille 
  size: number = 0;

  playMusic = signal<boolean>(false);
  //Au chargement on récupère les musiques
  ngOnInit(){
    this.allMusicFavorites.getAllMusicFavorites().subscribe({
      next: (data) => {
        //On récpère les données.
        this.musicFavorite = data;
        //Pour chaque musiques présente dans data on converti la duré en minute
        for (const music of this.musicFavorite) {
          this.minutes = Math.floor(music.duration / 60);
          this.secondes = music.duration % 60;
          //On converti la taille du fichier en MO
          this.size = Number(
            (music.size / (1024 * 1024)).toFixed(2)
          );
          this.musicFile = music.file;
        }
        
        console.log(data);
      },
      error: (err) => {
        console.error(err);
      }
    });
  };

  @ViewChild('audioOption') audioPlayerRef!: ElementRef<HTMLAudioElement>;

  //On joue la musique 
  onPlayMusic() {
     this.audioPlayerRef.nativeElement.play();
     this.playMusic.set(true);
  
  }

  onPauseMusic(){
    this.audioPlayerRef.nativeElement.pause();
    this.playMusic.set(false);
  }

  downloadMusic(id: number): void {
    this.allMusicFavorites.downloadMusic(id).subscribe({
      next: (file) => {
        if (!file.body) {
          return;
        }

        //On crée une URL temporaire pour le fichier reçu
        const url = window.URL.createObjectURL(file.body);

        //On récupère le nom envoyé par Django
        const disposition = file.headers.get('Content-Disposition');

        let filename = 'music';

        if(disposition) {
          const match = disposition.match(/filename="([^"]+)"/);

          if(match){
            filename = match[1];
          }
        }
        //On crée temporairement le lien de téléchargement
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;

        //On déclenche le téléchargement
        link.click();

        //On libère l'URL temporaire
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}
