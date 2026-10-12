import { Component, signal } from '@angular/core';
import { Description, Link, UpdateDescriptionAndLinkService } from './update-description-and-link.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-update-description-and-link',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatButton],
  templateUrl: './update-description-and-link.component.html',
  styleUrl: './update-description-and-link.component.css'
})
export class UpdateDescriptionAndLinkComponent {

  constructor(private getDescription: UpdateDescriptionAndLinkService){}

  //On déclare les variable qui vont stocker les données
  
  allLink = signal<Link[]>([]);
  

  websiteForm = new FormGroup({
    description: new FormControl(''),
    discord_link : new FormControl(''),
    tiktok_link: new FormControl(''),
    twitch_link: new FormControl(''),
    youtube_link: new FormControl('')
  });

  //On fait la requête au chargement de la page 
  ngOnInit() {
      this.getDescription.get_description().subscribe({
        next: (data) => {
          //Si aucune description
          if(data) {
             
             this.websiteForm.patchValue({
              description: data.description
             });
          }
          
          
        },
        error: (err) => {
          console.error(err.error.error);
        }
      })

      this.getDescription.get_link().subscribe({
        next: (data) => {
          this.allLink.set(data);

          for(const link of data){
            const control = this.websiteForm.get(link.name)

            if(control) {
              control.setValue(link.link);
            }
          }
        
        },
        error: (err) => {
          console.error(err.error.error);
        }
      })
  }

  sendRequest(){
    console.log("Valeur des input des liens", this.websiteForm.value);
    console.log("Valeur de la description", this.websiteForm.value.description);
  }
}
