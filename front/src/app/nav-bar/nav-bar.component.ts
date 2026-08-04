import { Component, inject, OnInit, signal } from '@angular/core';
import { UserComponent } from '../user/user.component';
import { AuthServiceService } from '../auth-service.service';
import { LoginComponent } from '../login/login.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule, MatButton, MatIconButton } from '@angular/material/button';
import { RegisterComponent } from '../register/register.component';
import { LoggedService } from '../logged.service';
import { DialogRef } from '@angular/cdk/dialog';
import { NavBarService } from './nav-bar.service';
import { Router, RouterLink } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { MatMenuModule} from '@angular/material/menu';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';



@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatButton, MatIconModule, MatMenuModule, MatIconButton, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})

export class NavBarComponent implements OnInit{

  constructor(private authservice: AuthServiceService, 
    private dialog: MatDialog, private navBarService: NavBarService, 
    private router: Router, private bottomSheet: MatBottomSheet) {}
  
  private loggedService = inject(LoggedService);

  isLogged = this.loggedService.isLogged;
  isStaff = this.loggedService.isStaff;

  successMessage = signal('');

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
