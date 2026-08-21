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

  playingMusicId = signal<number | null>(null);

  displayedColumns: string[] = ['title', 'category', 'duration', 'size', 'actions'];
  musicFavorite: AllMusicFavorites[] = [];
  //On récupère les minutes
  
  musicFile: string = ('');
  //On récupère la taille 
  // size: number = 0;

  playMusic = signal<boolean>(false);
  //Au chargement on récupère les musiques
  ngOnInit(){
    this.allMusicFavorites.getAllMusicFavorites().subscribe({
      next: (data) => {
        //On récpère les données.
        this.musicFavorite = data;
        console.log(this.musicFavorite);
        
      },
      error: (err) => {
        console.error(err);
      }
    });
  };
//On converti la durée en minutes et secondes
 formatDuration(duration: number): string {
    const minutes = Math.floor(duration / 60);
    const secondes = duration % 60;
    return `${minutes}:${secondes.toString().padStart(2, '0')}`
 }
//On converti la taille en MO
 formatSize(size: number): string {
  const sizeFile = Math.floor(size / (1024 * 1024));
  return `${sizeFile.toFixed(2)}`
  
 }
  playAudioMusic(audio: HTMLAudioElement, id: number):void {
    audio.play();
    this.playingMusicId.set(id);
  }

  stopAudioMusic(audio: HTMLAudioElement): void {
    audio.pause();
    audio.currentTime = 0;
    this.playingMusicId.set(null);
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
