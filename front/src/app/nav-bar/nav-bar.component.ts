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
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatInput } from "@angular/material/input";
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';




@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatButton, MatIconModule, MatMenuModule, MatIconButton, RouterLink, MatAutocompleteModule, MatInput, FormsModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})

export class NavBarComponent implements OnInit{


  searchControl = new FormControl('', { nonNullable: true});
  allMusic = signal<Music[]>([]);

  //On crée le signal searchInput
  searchInput = '';
  //On crée un signal pour filtrer les musiques
  fileteredMusic!: Observable<Music[]>;

  constructor(private authservice: AuthServiceService, 
    private dialog: MatDialog, private navBarService: NavBarService, 
    private router: Router, private bottomSheet: MatBottomSheet) {
      this.fileteredMusic = this.searchControl.valueChanges.pipe(
        startWith(''),
        map(value => this.filterMusic(value))
      );
    }
    sendRequest(): void {
      if (this.allMusic().length > 0) {
        return;
      }

      this.navBarService.getAllMusic().subscribe({
        next: (res) => {
          this.allMusic.set(res);

          this.searchControl.setValue(this.searchControl.value);
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
    private filterMusic(value: string): Music[] {
      const search = value.trim().toLowerCase();

      return this.allMusic().filter(music => music.title.toLowerCase().includes(search));
    }
  
  private loggedService = inject(LoggedService);

  isLogged = this.loggedService.isLogged;
  isStaff = this.loggedService.isStaff;

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

  
  
  
}
