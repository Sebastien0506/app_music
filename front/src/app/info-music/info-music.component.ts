import { Component, signal, ElementRef, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeleteMusic, InfoMusicService, Music } from './info-music.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UpdateMusicComponent } from '../update-music/update-music.component';
import { LoggedService } from '../logged.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-info-music',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatDialogModule, MatIconModule],
  templateUrl: './info-music.component.html',
  styleUrl: './info-music.component.css'
})
export class InfoMusicComponent {
  constructor(private getOneMusic: InfoMusicService, private router: ActivatedRoute, private isLogged: LoggedService, private addMusicFavorite: InfoMusicService, private downloadMusicService: InfoMusicService){}

  private dialog = inject(MatDialog);

  private snackBar = inject(MatSnackBar);

  errorMessage = signal('');
  minutes: number = 0;
  seconds: number = 0;
  size: number = 0;
  isFavorite = signal<boolean>(false);
  
  playMusic = signal<boolean>(false);

  successMessage = signal('');
  infoMusic: Music | null = null;

  user = signal<boolean>(false);
  ngOnInit(): void {
    const id = Number(this.router.snapshot.paramMap.get('id'));
     
    this.getOneMusic.getMusic(id).subscribe({
      next: (data) => {

        this.infoMusic = data;
       //On converti la duré en minute et secondes
        this.minutes = Math.floor(this.infoMusic.duration / 60);
        this.seconds = this.infoMusic.duration % 60;
        //On converti la taille du fichier en MO
        this.size = Number(
          (this.infoMusic.size / (1024 * 1024)).toFixed(2)
        );
        this.user.set(this.isLogged.isStaff());
      },
      error: (err) => {
        console.log(err);
      }
    });

  }

  // On met la musique en favori
addFavorite(id: number): void {
  this.addMusicFavorite.addMusicFavorite(id).subscribe({
    next: (res) => {
      this.isFavorite.set(true);

      this.successMessage.set(
        'Musique ajoutée aux favoris avec succès.'
      );

      this.snackBar.open(
        this.successMessage(),
        'Fermer',
        {
          duration: 3000
        }
      );
    },
    error: (err) => {
      console.error(err);
    }
  });
}
  @ViewChild('audioOption') audioPlayerRef!: ElementRef<HTMLAudioElement>;

  //On joue la musique 
  onAudioPlayer(): void {
    this.audioPlayerRef.nativeElement.play();
    this.playMusic.set(true);
  }

  //On stop la musique
  stopAudioPlayer(): void {
    this.audioPlayerRef.nativeElement.pause();
    this.audioPlayerRef.nativeElement.currentTime = 0;
    this.playMusic.set(false);
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(UpdateMusicComponent, {
      data: {
        dataMusic: this.infoMusic
      },
      width: "700px",
      height: "700px"
      
    });
  }
  downloadMusic(id: number): void {
    this.downloadMusicService.downloadMusic(id).subscribe({
      next: (file) => {
        if(!file.body){
           return;
        }

        //On crée l'url temporaire
        const url = window.URL.createObjectURL(file.body);

        //On récupère le nom envoyée par Django
        const disposition = file.headers.get('Content-Disposition');

        let filename = 'music';

        if(disposition) {
          const match = disposition.match(/filename="([^"]+)"/);

          if(match){
            filename = match[1];
          }
        }
        //On crée le lien temporairement 
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;

        //On déclenche le téléchargement
        link.click();

        //On libère l'url temporaire
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
