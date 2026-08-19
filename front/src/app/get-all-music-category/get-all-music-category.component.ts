import { Component, ViewChild, ElementRef, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetAllMusicCategory, GetAllMusicCategoryService } from './get-all-music-category.service'
import { MatTableModule } from '@angular/material/table';
import { MatButton } from "@angular/material/button";
import { Router } from '@angular/router';
@Component({
  selector: 'app-get-all-music-category',
  standalone: true,
  imports: [MatTableModule, MatButton],
  templateUrl: './get-all-music-category.component.html',
  styleUrl: './get-all-music-category.component.css'
})
export class GetAllMusicCategoryComponent {

  constructor(private router: ActivatedRoute, private getAllMusicCategoryService: GetAllMusicCategoryService, private route: Router){}

  displayedColumns: string[] = ['title', 'duration', 'size', 'actions']
  
  playingMusicId = signal<number | null>(null);

  //On déclare allMusic a un tableau vide
  allMusic: GetAllMusicCategory[] = [];

  //On déclare la taille du fichier
  size: number = 0;
  nameCategory: string = ('');
  //On récupère le titre
  title: string = ('');
  //Au chargement de la page 
  ngOnInit() {
    const id = Number(this.router.snapshot.paramMap.get('id'));
  
    this.getAllMusicCategoryService.getAllMusicCategory(id).subscribe({
      next: (data) => {
        this.allMusic = data;
  
        if (data.length > 0) {
          this.nameCategory = data[0].category;
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  formatDuration(duration: number): string {
    const minutes = Math.floor(duration / 60);
    const secondes = duration % 60;
  
    return `${minutes}:${secondes.toString().padStart(2, '0')}`;
  }
  
  formatSize(size: number): string {
    return (size / (1024 * 1024)).toFixed(2);
  }

  viewMusic(id: number){
    this.route.navigate(['/info_music', id])
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

}
