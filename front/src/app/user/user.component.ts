import { Component, inject, OnInit, signal } from '@angular/core';
import { User, UserService } from './user.service';
import { MatCardModule } from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatButton } from "@angular/material/button";
import { UserUpdateComponent } from '../user-update/user-update.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatCardModule, MatExpansionModule, MatButton],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit{

  constructor(private userService: UserService){}
  dialog = inject(MatDialog);
  user = signal<User | null>(null);
  successMessage = signal('');
  

  
  ngOnInit(): void {
    console.log('User component chargé');
    this.userService.sendRequestUser().subscribe({
      next: (res) => {
        console.log('Réponse :', res);
        this.user.set(res);
        console.log('Signal :', this.user());

        // console.log('Username enregistré :', this.username);
      },
      error: (err) => {
        console.error(err);
      }
    });
      
  }
  
  openDialog(){
    const dialogRef = this.dialog.open(UserUpdateComponent, {
      data: {
        userData: this.user(),
      },
      width: '700px',
      height: '700px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if(!result?.success) {
        return;
      }
      this.successMessage.set(result.message);

      this.user.update(currentUser => {
        if (!currentUser) {
          return currentUser;
        }
        return {
          ...currentUser,
          ...result.user
        };
      });
    });
  }

 
  

}
