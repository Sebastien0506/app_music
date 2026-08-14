import { Component, signal, ElementRef, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeleteMusic, InfoMusicService, Music } from './info-music.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UpdateMusicComponent } from '../update-music/update-music.component';
import { LoggedService } from '../logged.service';
@Component({
  selector: 'app-info-music',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatDialogModule],
  templateUrl: './info-music.component.html',
  styleUrl: './info-music.component.css'
})
export class InfoMusicComponent {
  constructor(private getOneMusic: InfoMusicService, private router: ActivatedRoute, private isLogged: LoggedService){}

  private dialog = inject(MatDialog);

  errorMessage = signal('');
  minutes: number = 0;
  seconds: number = 0;
  size: number = 0;

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

  @ViewChild('audioOption') audioPlayerRef!: ElementRef<HTMLAudioElement>;

  onAudioPlayer(): void {
    this.audioPlayerRef.nativeElement.play();
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
}
