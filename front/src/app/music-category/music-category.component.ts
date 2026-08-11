import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MusicCategory, MusicCategoryService } from './music-category.service';
import { MatTableModule } from '@angular/material/table';


@Component({
  selector: 'app-music-category',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './music-category.component.html',
  styleUrl: './music-category.component.css'
})
export class MusicCategoryComponent implements OnInit {
  constructor(private route: ActivatedRoute, private musicCategoryService: MusicCategoryService){}

  music: MusicCategory[] = [];
  
  displayedColumns: string[] = ['title', 'duration', 'player'];
  ngOnInit(){
    //On récupère l'id dans l'url
     const id = this.route.snapshot.paramMap.get('id');

     //On fait la requête
     this.musicCategoryService.getMusiccategory(Number(id)).subscribe({
         next: (data) => {
          this.music = data;
          console.log(this.music);
         },
         error: (err) => {
          console.error(err);
         }
     });


  }

  formatDuration(duration: number): string {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  

}
