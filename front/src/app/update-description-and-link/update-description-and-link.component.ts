import { Component, signal, inject } from '@angular/core';
import { Description, Link, UpdateDescriptionAndLinkService } from './update-description-and-link.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-update-description-and-link',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatButton, MatCardModule],
  templateUrl: './update-description-and-link.component.html',
  styleUrl: './update-description-and-link.component.css'
})
export class UpdateDescriptionAndLinkComponent {

  constructor(private updateDescriptionAndLinkService: UpdateDescriptionAndLinkService){}

  //On déclare les variable qui vont stocker les données
  
  allLink = signal<Link[]>([]);

  //On définit une variable pour les message d'erreur
  errorMessage = signal('');

  //On définit une variable pour stocker les messages de succes
  successMessage = signal('');
  
  snackBar = inject(MatSnackBar);
  websiteForm = new FormGroup({
    description: new FormControl(''),
    discord_link : new FormControl(''),
    tiktok_link: new FormControl(''),
    twitch_link: new FormControl(''),
    youtube_link: new FormControl('')
  });

  //On fait la requête au chargement de la page 
  ngOnInit() {
      this.updateDescriptionAndLinkService.get_description().subscribe({
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

      this.updateDescriptionAndLinkService.get_link().subscribe({
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

  checkDescription(): boolean{
    //On récupère la description
    const description = this.websiteForm.value.description;
    console.log("Description du site :", description);

    if(description){
        //On crée le regex
        const regexDescription = /^[\p{L}\p{N} '‘_.-]+$/u;

        //On normalize la description
        const normalizeDescription = description.normalize("NFC");
        console.log("Description normalizer : ", normalizeDescription);
        
        //On vérifie si la description contient uniquement des caractères autorisée.
        if(!regexDescription.test(normalizeDescription)){
          this.errorMessage.set('La description contient des caractères non autorisée.');
          this.snackBar.open(this.errorMessage(), 
          "Fermer", 
          { duration: 3000}
          )
          return false
        }
        return true
    }
    
    return true
  }

  checkLink(): boolean{
    //On récupère les valeur des liens
    const discordLink = this.websiteForm.value.discord_link;
    const twitchLink = this.websiteForm.value.twitch_link;
    const tiktokLink = this.websiteForm.value.tiktok_link;
    const youtubeLink = this.websiteForm.value.youtube_link;

    //On définit les host autorisée.
    const allowedHost = [
      "www.tiktok.com",
      "www.discord.com",
      "www.twitch.tv",
      "www.youtube.com",
      "discord.gg",
    ]

    //On crée un tableau pour stocker tous les hostname des différents liens
    const hostnameLinkOfSocialNetwork: string []= [];

    try {
      //Si le lien discord est présent
      if(discordLink){
        //On récupère l'url
        const url = new URL(discordLink);
        
        //On récupère le hostname
        const hostnameDiscord = url.hostname
        hostnameLinkOfSocialNetwork.push(hostnameDiscord);

        if(url.protocol !== "https:"){
          this.errorMessage.set("Le protocole du lien discord n'est pas 'https:' ");
          this.snackBar.open(this.errorMessage(), "Fermer", {duration: 3000});
          return false;

        }
        //On récupère le pathname
        const pathnanmeDiscord = url.pathname.substring(1);
        
        //On crée le regex pour vérifie le pathname discord
        const regexPathnameDiscord = /^[\p{L}\p{N}]+$/u;
        if(!regexPathnameDiscord.test(pathnanmeDiscord)){
          this.errorMessage.set("Le lien discord contient des caractères non autorisée.");
          this.snackBar.open(
            this.errorMessage(),
            "Fermer",
            {
              duration: 3000
            }
          )
          return false;
        }
        // return true;
      }
      //Si on a le lien twitch
      if(twitchLink){
        //On récupère son url
        const url = new URL(twitchLink);
        console.log("Url de twitch", url);
        //On vérifie le protocole https
        if(url.protocol !== "https:"){
          this.errorMessage.set("Le protocole de twitch n'est pas 'https' ");
          this.snackBar.open(
            this.errorMessage(),
            "Fermer",
            {
              duration: 3000
            }
          );
          return false;
        }
        //on récupère le hostname
        const hostnameTwitch = url.hostname;

        //On met le hostname de twitch dans le tableau
        hostnameLinkOfSocialNetwork.push(hostnameTwitch);

        //On récupère le pathname de twitch
        const pathnameTwitch = url.pathname.substring(1);
        console.log("pathname de twitch :", pathnameTwitch);
        //On crée le regex
        const regexTwitch = /^[\p{L}\p{N}]+$/u;

        //Si le lien titch contient des caractère non autorisée on renvoi un message d'erreur.
        if(!regexTwitch.test(pathnameTwitch)){
          this.errorMessage.set("Le nom Twitch contient des caractères non autorisée.");
          this.snackBar.open(
            this.errorMessage(),
            "Fermer",
            {
              duration: 3000
            }
          )
          return false;
        }
        // return true;
      }

      //Si on a le lien tiktok
      if(tiktokLink){
        //On récupère l'url
        const url = new URL(tiktokLink);

        //On vérifie le protocole https
        if(url.protocol !== "https:"){
          this.errorMessage.set("Le protocole de tiktok n'est pas 'https' ");
          this.snackBar.open(
            this.errorMessage(),
            "Fermer",
            {
              duration: 3000
            }
          )
          return false;
        }
        //On récupère le hostname
        const hostnameTiktok = url.hostname;

        //On push le hostname dans le tableau
        hostnameLinkOfSocialNetwork.push(hostnameTiktok);

        //On récupère le pathname
        const pathnameTiktok = url.pathname.substring(1);

        //On vérifie qu'il inclu bien un @ au debut
        if(!pathnameTiktok.startsWith("@")){
          this.errorMessage.set("Le pathname de tiktok ne contient pas de @.");
          this.snackBar.open(
            this.errorMessage(),
            "Fermer",
            {
              duration: 3000
            }
          )
          return false;
        }

        //On crée le regex pour tiktok
        const regexTiktok = /^@[\p{L}\p{N}]+$/u;

        //On verifie que le lien tiktok contient uniquement des caractères autorisée.
        if(!regexTiktok.test(pathnameTiktok)){
          this.errorMessage.set("Le lien Tiktok contient des caractères non autorisée.");
          this.snackBar.open(
            this.errorMessage(),
            "Fermer",
            {
              duration: 3000
            }
          );
          return false;
        } 
        // return true;
      }

      //Si on a le lien youtube
      if(youtubeLink){
        //On récupère l'url
        const url = new URL(youtubeLink);

        //On vérifie le protocole https
        if(url.protocol !== "https:"){
          this.errorMessage.set("Le protocole https de youtube n'est pas valide.");
          this.snackBar.open(
            this.errorMessage(),
            "Fermer",
            {
              duration: 3000
            }
          )
          return false;
        }

        //On récupère le hostname
        const hostnameYoutube = url.hostname;
        //On push le hostname dans le tableau
        hostnameLinkOfSocialNetwork.push(hostnameYoutube);

        //On récupère le pathname
        const pathnameYoutube = url.pathname.substring(1);
        console.log("Pathname de youtube : ", pathnameYoutube);
        //On vérifie que le pathname commence bien par un @
        if(!pathnameYoutube.startsWith("@")){
          this.errorMessage.set("Le pathname de youtube ne contient pas de @.");
          this.snackBar.open(
            this.errorMessage(),
            "Fermer",
            {
              duration: 3000
            }
          )
          return false;
        }

        //On crée le regex de youtube
        const regexYoutube = /^@[\p{L}\p{N}]+$/u;

        //On vérifie si le pathname contient des caractères non autorisée.
        if(!regexYoutube.test(pathnameYoutube)){
          this.errorMessage.set("Le pathname de youtube est invalide.");
          this.snackBar.open(
            this.errorMessage(),
            "Fermer",
            {
              duration: 3000
            }
          )
          return false;
        }
        // return true;
      }

      //Pour chaque hostname on vérifie qu'il sont bien accepter
      for(const hostnameLink of hostnameLinkOfSocialNetwork){
        if(!allowedHost.includes(hostnameLink)){
          this.errorMessage.set("Le nom de domaine n'est pas autorisée.");
          this.snackBar.open(
            this.errorMessage(),
            "Fermer",
            {
              duration: 3000
            }
          );
          return false;
        }
      }

    } catch(error){
        this.errorMessage.set("Un des lien renseigner n'est pas une url valide.");
        this.snackBar.open(
          this.errorMessage(),
          "Fermer",
          {
            duration: 3000
          }
        );
        return false;
    }
    return true
  }
  sendRequest(){
    //On vérifie si les données son correct
    const checkDescription = this.checkDescription();
    const checkLink = this.checkLink();

    if(!checkDescription || !checkLink){
      return;
    }

   //On stock les données dans la variable data
    const data = {
      description : this.websiteForm.value.description,
      discord_link : this.websiteForm.value.discord_link,
      twitch_link: this.websiteForm.value.twitch_link,
      tiktok_link: this.websiteForm.value.tiktok_link,
      youtube_link: this.websiteForm.value.youtube_link
    }

    //On fait la requête
    this.updateDescriptionAndLinkService.updateWebsite(data).subscribe({
      next: (res) => {
        this.successMessage.set(res.success);
        this.snackBar.open(
          this.successMessage(),
          "Fermer",
          {
            duration: 5000
          }
        )
      },
      error: (err) => {
        console.error(err.error.error);
        this.errorMessage.set("Une erreur c'est produit.");
        this.snackBar.open(
          this.errorMessage(),
          "Fermer",
          {
            duration: 5000
          }
        )
      },
    });
  }
    
}
