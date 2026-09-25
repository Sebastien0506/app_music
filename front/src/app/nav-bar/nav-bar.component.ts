import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { UserComponent } from '../user/user.component';
import { AuthServiceService } from '../auth-service.service';
import { LoginComponent } from '../login/login.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule, MatButton, MatIconButton } from '@angular/material/button';
import { RegisterComponent } from '../register/register.component';
import { LoggedService } from '../logged.service';
import { DialogRef } from '@angular/cdk/dialog';
import { Music, NavBarService } from './nav-bar.service';
import { Router, RouterLink } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { MatMenuModule} from '@angular/material/menu';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import { MatInput } from "@angular/material/input";
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SettingsComponent } from '../settings/settings.component';




@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatButton, MatIconModule, MatMenuModule, MatIconButton, RouterLink, MatAutocompleteModule, MatInput, FormsModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})

export class NavBarComponent implements OnInit{


  searchControl = new FormControl('', { nonNullable: true});
  allMusic : Music[] =[];

  //On crée le signal searchInput
  searchInput = signal('');

  //On crée un signal pour filtrer les musiques
  fileteredMusic: Music[] = [];

  constructor(private authservice: AuthServiceService, 
    private dialog: MatDialog, private navBarService: NavBarService, 
    private router: Router, private bottomSheet: MatBottomSheet) {}
    
    sendRequest(): void {
      if (this.allMusic.length > 0) {
        return;
      }

      this.navBarService.getAllMusic().subscribe({
        next: (data) => {
          this.allMusic = data;

          this.searchControl.setValue(this.searchControl.value);
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
    //On fait l'event pour chercher la musique
    filterMusic() {
      console.log("fonction appelé.");
        let searchInput = this.searchControl.value.toLowerCase();

        const musicTitle: string[] = [];

         console.log("Test de recherche de musique:", searchInput);

         if(!searchInput) {
          this.fileteredMusic = [];
          return;
         }
         this.fileteredMusic = [];
         //On normalise le titre rechercher pour inclure les lettre avec accent
        const normalizeNameMusic = searchInput.normalize("NFC");
        console.log(normalizeNameMusic);

        //On fait le regex
        const regex = /^[\p{L}\p{N}_ '’-]+$/u;
      
        if(!regex.test(normalizeNameMusic)){
          return;
        }
        //Pour chaque musique present dans allMusic on vérifie si les lettre correspond
        for( const music of this.allMusic) {
          console.log("Test du for");
          if(music.title.includes(normalizeNameMusic)){
            this.fileteredMusic.push(music);
            console.log("Test du if", music.title);
          }
          
        }

      
    }
  
  private loggedService = inject(LoggedService);

  isLogged = this.loggedService.isLogged;
  isStaff = this.loggedService.isStaff;
  errorMessage = signal('');
  successMessage = signal('');
  
  //On crée un signal pour récupérer toutes les musiques
  

  ngOnInit(): void {
      this.loggedService.checkLogin();
      
  }
  
  logout() {
    this.navBarService.logoutUser().subscribe({
      next: (res) => {
        this.loggedService.userLogout();
        this.loggedService.isStaff.set(false);
        this.successMessage.set('Utilisateur déconnecter avec succès.');
        console.log(res);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  ouvrirFormulaireLogin(){
    const dialogRef = this.dialog.open(LoginComponent, {
      height: '700px',
      width: '700px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result === 'reset-password') {
        this.router.navigate(['/forms_reset_password']);
      }
    });
    
  }

  ouvrirFormulaireRegister(){
    this.dialog.open(RegisterComponent, {
      height: '700px',
      width: '700px',
    });
    
  }

  openBottomSheet(){
    const bottomSheetRef = this.bottomSheet.open(AdminDashboardComponent, {
      ariaLabel: 'Share on social media'
    });
    
  }

  openSettingBottomSheet() {
    const bottomSheetRef = this.bottomSheet.open(SettingsComponent, {
      ariaLabel: 'Share on social media'
    });
  }


  selectMusic(event: MatAutocompleteSelectedEvent): void {
    const music = event.option.value as Music;

    console.log(music.id);
    console.log(music.title);

    this.router.navigate(['/info_music', music.id])
  }

  // //On fait la fonction pour rediriger l'utilisateur quand il a sélectioner une musique
  // infoMusic(){
  //    if(!this.searchInput){
  //     this.errorMessage.set('Aucune musique est sélectionner.');
  //    }
  //    console.log(music.id)
  //   //  this.router.navigate(["/info_music", this.searchInput]);
  // }
  
  
}
