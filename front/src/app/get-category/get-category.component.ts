import { Component, OnInit, signal } from '@angular/core';
import { MatTableModule} from '@angular/material/table';
import { Category, GetCategoryService } from './get-category.service';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CreateCategoryComponent } from '../create-category/create-category.component';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-get-category',
  standalone: true,
  imports: [MatTableModule, MatDialogModule, MatButtonModule],
  templateUrl: './get-category.component.html',
  styleUrl: './get-category.component.css'
})
export class GetCategoryComponent {

  constructor(private getCategory: GetCategoryService, private dialogRef: MatDialog, private router: Router){}

  categories: Category[] = [];
  displayedColumns: string[] = ['category_name', 'actions'];

  openForms(){
    this.dialogRef.open(CreateCategoryComponent, {
      height: '700px',
      width: '700px',
    });

  }

  //On définit la variable pour stocke les nom des catégories
  // category_name = signal('');
  
  ngOnInit() {
    
    //On fait la requête
    this.getCategory.getCtegoryAll().subscribe({
      next: (data) => {
        
        this.categories = data;
        console.log(this.categories);
        //On récupère le nom des catégorie
        
      }
    })

  }


viewMusic(id: number){
  this.router.navigate(["/category", id, 'musics'])
}

updateCategory(id: number) {}

deleteCategory(id: number) {}




}
