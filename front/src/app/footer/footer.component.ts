import { Component, signal } from '@angular/core';
import { FooterService, GetLink } from './footer.service';


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  constructor(private getLink: FooterService){};

  AllLink = signal<GetLink[]>([]); 
 

  ngOnInit(){
    //On fait la requête pour récupérer les liens
    this.getLink.getLink().subscribe({
      next: (data) => {
        if(data.length > 0){
            this.AllLink.set(data);
           
        }
  
          
        
        
        console.log(this.AllLink);
      },
      error: (err) => {

      }
    })
  }

}
