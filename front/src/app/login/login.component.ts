import { Component } from '@angular/core';
import { MatDialog, MatDialogContent } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
  
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatDialogContent, MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private dialog: MatDialog){}

  ouvrirFormulaire(){
    this.dialog.open
  }

  

}
