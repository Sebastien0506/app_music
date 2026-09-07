import { Component, inject } from '@angular/core';
import { MatList, MatListModule } from "@angular/material/list";
import { MatButton } from '@angular/material/button';
import { LoggedService } from '../logged.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddAvatarComponent } from '../add-avatar/add-avatar.component';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatList, MatListModule, MatButton],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  constructor(){}

  //On inject LoggedService pour voir si l'utilisateur est connecter et si il à le rôle admin
  private loggedService = inject(LoggedService);
  private dialog = inject(MatDialog);

  //On récupère isStaff et la valeur pou savoir si l'utilisateur est connecter
  islogged = this.loggedService.isLogged;
  isStaff = this.loggedService.isStaff

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
