import { Component, signal, inject } from '@angular/core';
import { AllMusic, GetAllMusicService } from './get-all-music.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { LoggedService } from '../logged.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UpdateMusicComponent } from '../update-music/update-music.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { InfoMusicService } from '../info-music/info-music.service';
@Component({
  selector: 'app-get-all-music',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatCardModule, MatIconModule, MatMenuModule],
  templateUrl: './get-all-music.component.html',
  styleUrl: './get-all-music.component.css'
})
export class GetAllMusicComponent {

  displayedColumns: string[] = ['title', 'duration', 'category', 'actions'];

  constructor(private getAllMusic: GetAllMusicService, private loggedService: LoggedService, private router: Router){}
  private snackBar = inject(MatSnackBar);

  private addFavorite = inject(InfoMusicService);

  private dialog = inject(MatDialog);
  successDeleteMessage = signal('');
  errorMessage = signal('');
  //on initialise la varaible AllMusic a un tableau vide 
  AllMusic : AllMusic[] = [];
  infoMusic : AllMusic | undefined;
  user = signal<Boolean>(false);

  //On initialise un signal pour le cas ou il n'y a pas de musique liké
  notMusicLike = signal('');

  //On initialise un signal pour le cas ou il n'y a pas de musique télécharger
  notDownloadMusic = signal('');

  imageError: Record<number, boolean> = {};

  onImageError(musicId: number): void {
    this.imageError[musicId] = true;
  }
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

  //On crée la fonction pour supprimer une musique
  deleteMusic(id: number) {
    this.getAllMusic.removeMusic(id).subscribe({
      next: (res) => {
        this.successDeleteMessage.set('Suppression de la musique réussi.');
        this.AllMusic = this.AllMusic.filter(
          music => music.id !== id
        );
        this.snackBar.open(
          this.successDeleteMessage(),
          'Fermer',
          {
            duration: 3000
          }
        );
      },
      error: (err) => {
        this.errorMessage.set("Erreur lors de suppression");
      }
    });
  }

  
  formaDuration(duration: number): string{
    const minutes = Math.floor(duration / 60);
    const secondes = duration % 60;

    return `${minutes}:${secondes.toString().padStart(2, '0')}`
  }

  dataInfoMusic(id: number){
   //On récupère les informations de la musique
    this.infoMusic = this.AllMusic.find(
      music => music.id === id
    );
    console.log(this.infoMusic);
  }

  openDialog(id: number){
    this.dataInfoMusic(id);
    this.dialog.open(UpdateMusicComponent, {
      data: {
        dataMusic: this.infoMusic
      },
      width: '700px',
      height: '700px',
    })
  }

  filterMusicByLike(){
    this.getAllMusic.getMusicByLike().subscribe({
      next: (data) => {
         
         if(data.length > 0){
          console.log("test fonction filter");
          this.AllMusic = data;
          console.log(this.AllMusic);
          
         } else {
          this.notMusicLike.set("Aucune musique n'a de like.");
          this.snackBar.open(
            this.notMusicLike(),
            'Fermer',
            {
              duration: 3000
            }
          );
         }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  //On créé la focntion pour récuperer les musique par leur nombre de téléchargement
  filterMusicByDownload(){
    this.getAllMusic.getMusicByDownload().subscribe({
      next: (data) => {
        //Si data contient au moins une données on l'affiche
        if(data.length > 0) {
          this.AllMusic = data;
          console.log(this.AllMusic);
        } else {
          this.notDownloadMusic.set('Aucune musique n\'a été télécharger pour le moment.');
          //On met le message dans la snackbar
          this.snackBar.open(
            this.notDownloadMusic(),
            "Fermer", 
            {
              duration: 3000
            }
          )
        };
      },
      error : (err) => {
        console.error(err);
      }
    })
  }

  addFavoritesMusic(id: number){
    this.addFavorite.addMusicFavorite(id).subscribe({
      next: (res) => {
        console.log(res);

        const music = this.AllMusic.find(
          music => music.id === id
        );

        if (music) {
          music.isFavorites = true;
          music.countLike++;
        }
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  addDownloadMusic(id : number) {
    this.addFavorite.downloadMusic(id).subscribe({
      next: (file) => {
        console.log(file);

        if(!file.body) {
           return 
        }
        //On crée l'url temporaire
        const url = window.URL.createObjectURL(file.body);

        //On récupère le nom envoyer par django
        const disposition = file.headers.get("Content-Disposition");

        let filename = "music";

        if(disposition) {
          const match = disposition.match(/filename="([^"]+)"/);

          if (match) {
            filename = match[1];
          }
        }

        //On crée le lien temporaire
        const link = document.createElement('a');

        link.href = url;
        link.download = filename;

        //On déclenche le téléchargement
        link.click();

        //On libère l'url temporaire
        window.URL.revokeObjectURL(url);

        const music = this.AllMusic.find(music => music.id === id);

        if(music?.countDownload){
          music.countDownload++;
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  
}
