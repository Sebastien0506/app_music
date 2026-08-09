import { Component } from '@angular/core';
import { MatTableModule} from '@angular/material/table';
import { GetCategoryService } from './get-category.service';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CreateCategoryComponent } from '../create-category/create-category.component';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-get-category',
  standalone: true,
  imports: [MatTableModule, MatDialogModule, MatButtonModule],
  templateUrl: './get-category.component.html',
  styleUrl: './get-category.component.css'
})
export class GetCategoryComponent {

  constructor(private getCategory: GetCategoryService, private dialogRef: MatDialog){}

  openForms(){
    this.dialogRef.open(CreateCategoryComponent, {
      height: '700px',
      width: '700px',
    });

  }



}
