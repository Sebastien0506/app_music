import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-info-music',
  standalone: true,
  imports: [],
  templateUrl: './info-music.component.html',
  styleUrl: './info-music.component.css'
})
export class InfoMusicComponent {
  constructor(private route: ActivatedRoute){}

  ngOnInit(): void {
    const musicId = Number(
      this.route.snapshot.paramMap.get('id')
    );
    console.log(musicId);
  }



}
