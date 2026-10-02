import { Component, Signal, signal, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule, FormControl, FormArray } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-description',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButton, ReactiveFormsModule],
  templateUrl: './description.component.html',
  styleUrl: './description.component.css'
})
export class DescriptionComponent {
   
  constructor(){}

  //On déclare la variable qui va recevoir le message
  descriptionInput = new FormControl('');

  //On déclare la variable qui va recevoir les lien
  linksInput = new FormArray([
    new FormControl('', {nonNullable: true})
  ])

  errorMessage = signal('');

  //On crée le dialogue
  dialog = inject(MatDialog);
  
  // //On déclare la variable pour ajouter des nouveau champs vide
  // newInputLinks = [''];

  // //On déclare la variable pour ajouter les nouveaux lien dans un tableau
  // links: string[] = [];

  //On crée les signal pour savoir si les input sont ouvert
  viewDiscordInput = signal(false);
  viewTwitchInput = signal(false);
  viewTikTokInput = signal(false);
  viewYouTubeInput = signal(false);

  //On déclare les variable pour stocker les différents lien
  discordInput = new FormControl('');
  twitchInput = new FormControl('');
  tiktokInput = new FormControl('');
  youtubeInput = new FormControl('');

  //On fait les fonction pour ouvrir les input
  viewDiscord(){
     this.viewDiscordInput.update(value => !value);
  }
  viewTwitch(){
     this.viewTwitchInput.update(value => !value);
  }
  viewTikTok(){
     this.viewTikTokInput.update(value => !value);
  }
  viewYouTube(){
     this.viewYouTubeInput.update(value => !value);
  }

  //Fonction pour verifier les liens
  checkLink(): boolean{
    //On récupère tous les lien
    const discordLink = this.discordInput.value;
    const twitchLink = this.twitchInput.value;
    const tiktokLink = this.tiktokInput.value;
    const youtubeLink = this.youtubeInput.value;

    //On définit tous les hostname autorisée.
    const allowedHostname = [
      "www.tiktok.com",
      "www.discord.com",
      "www.twitch.tv",
      "www.youtube.com",
      "discord.gg",
    ]
    
    //On crée un tableau pour stocker tous les hostname des lien
    const hostnameLinkOfSocialNetwork: string[] = [];

    try {
      //On crée les fonctions pour récupérer les hostname des liens
    if(discordLink) {
      const url = new URL(discordLink);
      //On vérifie si le protocole est https
      if(url.protocol !== "https:"){
          this.errorMessage.set("Le protocole https n'est pas respecter.");
          const dialogRef = this.dialog.open(MessageDialogComponent, {
            data: {
              message: this.errorMessage
            }
          });
          return false;
      }
      hostnameLinkOfSocialNetwork.push(url.hostname);

      //On crée le regex pour valider le pathname de discord
      const regexDiscord = /^[\p{L}\p{N}]+$/u;

      //On récupère le pathname de discord
      const discordPathname = url.pathname.substring(1);
      console.log("test pathname discord :", discordPathname);
      //On vérifie si il est autorisée.
      if(!regexDiscord.test(discordPathname)){
        this.errorMessage.set("Le pathname de discord n'est pas autorisée.");
        const dialogRef = this.dialog.open(MessageDialogComponent, {
          data: {
            message: this.errorMessage
          }
        });
        return false;
      }
      
    }

    if(twitchLink){
      const url = new URL(twitchLink);

      //On vérifie si le protocole est https
      if(url.protocol !== "https:"){
        this.errorMessage.set("Le protocole https n'est pas respecter.");
        const dialogRef = this.dialog.open(MessageDialogComponent, {
          data: {
            message: this.errorMessage
          }
        });
        return false;
      }
      //On push dans le tableau le hostname
      hostnameLinkOfSocialNetwork.push(url.hostname);
      
      //On crée le regex pour le lien twitch
      const regexTwitch = /^[\p{L}\p{N}]+$/u;

      //On récupère le pathname de twitch
      const twitchPathname = url.pathname.substring(1);
      
      console.log("Pathname twitch :", twitchPathname);
      //On vérifie si il est autorisée.
      if(!regexTwitch.test(twitchPathname)){
        this.errorMessage.set("Le pathname de twitch n'est pas autorisée.");
        const dialogRef = this.dialog.open(MessageDialogComponent, {
          data: {
            message : this.errorMessage
          }
        });
        return false;
      }
      
    }

    if(tiktokLink){
      const url = new URL(tiktokLink);

      //On vérifie si le protocole est https
      if(url.protocol !== "https:"){
        this.errorMessage.set("Le protocole https n'est pas respecter.");
        const dialogRef = this.dialog.open(MessageDialogComponent, {
          data: {
            message: this.errorMessage
          }
        });
        return false;
      }
      hostnameLinkOfSocialNetwork.push(url.hostname);

      //On crée le regex pour tiktok
      const regexTiktok = /^[@\p{L}\p{N}]+$/u;

      //On récupère le pathname de tiktok
      const tiktokPathname = url.pathname.substring(1);
      console.log("Pathname tiktok :", tiktokPathname);
      //On vérifie si il est autorisée.
      if(!regexTiktok.test(tiktokPathname)){
        this.errorMessage.set("Le pathname de tiktok n'est pas autorisée.");
        const dialogRef = this.dialog.open(MessageDialogComponent, {
          data: {
            message: this.errorMessage
          }
        });
        return false;
      }
      
    }
    if(youtubeLink) {
      const url = new URL(youtubeLink);

      //On vérifie si le protocole est https
      if(url.protocol !== "https:"){
        this.errorMessage.set("Le protocole https n'est pas respecter.");
        const dialogRef = this.dialog.open(MessageDialogComponent, {
          data: {
            message: this.errorMessage
          }
        });
        return false;
      }
      hostnameLinkOfSocialNetwork.push(url.hostname);

      //On crée le regex pour le lien youtube
      const regexYoutube = /^[@\p{L}\p{N}]+$/u;

      //On récupère le pathname de youtube 
      const youtubePathname = url.pathname.substring(1);
      console.log("Pathname de youtube :", youtubePathname)
      //On vérifie si il est autorisée.
      if(!regexYoutube.test(youtubePathname)){
        this.errorMessage.set("Le pathname de youtube n'est pas autorisée.");
        const dialogRef = this.dialog.open(MessageDialogComponent, {
          data: {
            message: this.errorMessage
          }
        });
        return false;
      }
      
    }
    
    //Pour chaque hostname présent dans hostnameLinkOfSocialNetwork on vérifie qu'il est autorisé
    for(const hostnameLink of hostnameLinkOfSocialNetwork) {
        if(!allowedHostname.includes(hostnameLink)){
          this.errorMessage.set("Le nom de domaine n'est pas autorisée.");
          const dialogRef = this.dialog.open(MessageDialogComponent, {
             data: {
              message : this.errorMessage
             }
          });
          return false;
        }
        
    }

    } catch(error) {
         this.errorMessage.set("Un des lien renseignés n'est pas une URL valide.");
         this.dialog.open(MessageDialogComponent, {
          data: {
            message: this.errorMessage
          }
         });
         return false;
    }
    console.log(hostnameLinkOfSocialNetwork);
    
    return true;  
  }

  checkDescription(): boolean{
    //On récupère la valeur du champs
    const newDescription = this.descriptionInput.value;
    console.log("Texte :", newDescription);
    
    //Si il n'y a pas de description on affiche un message d'erreur
    if(!newDescription){
      //  this.errorMessage.set("La description est vide.");
       const dialogRef = this.dialog.open(MessageDialogComponent, {
        data: {
          message : this.errorMessage.set("La description est vide."),
        }
       });
      return false;
    }

    //On définit le regex
    const regex = /^[\p{L}\p{N}. '’-]+$/u;
    
    //On normalise la description
    const normaliseDescription = newDescription?.normalize("NFC");
    console.log("Normalization du texte:", normaliseDescription);
    //On vérifie que la description contient uniquement des caractères autorisée.
    if(!regex.test(normaliseDescription)){
        return false;
    }
    return true;
  }

  sendRequest(){
    const checkDescription = this.checkDescription();
    const checkLink = this.checkLink()

    if(!checkDescription){
      return;
    }

    if(!checkLink){
      return;
    }
    console.log(checkDescription);
    console.log(checkLink);
    
  }
}
