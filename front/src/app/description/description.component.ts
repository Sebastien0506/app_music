import { Component, Signal, signal, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
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
  errorMessage = signal('');

  //On crée le dialogue
  dialog = inject(MatDialog);

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

    // if(!newDescription){
    //   return;
    // }

    // const words = newDescription.split(' ')
    // console.log(words);

    // const wordInDescription: string[] = [];
    

    //Si le mot commence par 'https://'
    // for(const word of words){
      

    //     try{
    //       const url = new URL(word);
    //       wordInDescription.push(url.hostname);
    //       console.log("lien",wordInDescription);
    //       console.log("Protocol", url.protocol);
    //       //On vérifie le protocole
    //       if(url.protocol !== "https:"){
    //         console.log("Le protocole https n'est pas valide");
    //       }
    //     } catch{
    //       console.log("URL invalide");
    //     }
    //     console.log(word);
    //   }
    // }

    // for( const word of words){
    //      wordInDescription.push(word);
    // }
    // console.log(wordInDescription);
  }

  sendRequest(){
    const checkDescription = this.checkDescription();
    console.log(checkDescription);
    
  }
}
