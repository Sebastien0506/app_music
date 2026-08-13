import { Component, signal, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeleteMusic, InfoMusicService, Music } from './info-music.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-info-music',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './info-music.component.html',
  styleUrl: './info-music.component.css'
})
export class InfoMusicComponent {
  constructor(private getOneMusic: InfoMusicService, private router: ActivatedRoute){}

  errorMessage = signal('');
  minutes: number = 0;
  seconds: number = 0;
  size: number = 0;

  infoMusic: Music | null = null;

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

}
