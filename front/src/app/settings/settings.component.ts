import { Component, inject, signal, Signal } from '@angular/core';
import { MatList, MatListModule } from "@angular/material/list";
import { MatButton } from '@angular/material/button';
import { LoggedService } from '../logged.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddAvatarComponent } from '../add-avatar/add-avatar.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ThemeService } from '../theme.service';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatList, MatListModule, MatButton, MatSlideToggleModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  constructor(public themeService: ThemeService){}

  //On inject LoggedService pour voir si l'utilisateur est connecter et si il à le rôle admin
  private loggedService = inject(LoggedService);
  private dialog = inject(MatDialog);

  //On récupère isStaff et la valeur pou savoir si l'utilisateur est connecter
  islogged = this.loggedService.isLogged;
  isStaff = this.loggedService.isStaff;

  isSelectedDarkMode = signal(false);

  ngOnInit(): void {
    this.loggedService.checkLogin();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddAvatarComponent, {
      width: '700px',
      height: '700px'
    });
  }

 
 


}
