import { Component, signal, inject } from '@angular/core';
import { AllMusic, GetAllMusicService } from './get-all-music.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { LoggedService } from '../logged.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UpdateMusicComponent } from '../update-music/update-music.component';

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
  private snackBar = inject(MatSnackBar);

  private dialog = inject(MatDialog);
  successDeleteMessage = signal('');
  errorMessage = signal('');
  //on initialise la varaible AllMusic a un tableau vide 
  AllMusic : AllMusic[] = [];
  infoMusic : AllMusic | undefined;
  
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
}
