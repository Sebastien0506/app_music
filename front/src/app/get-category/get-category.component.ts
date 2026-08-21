import { Component, OnInit, signal } from '@angular/core';
import { MatTableModule} from '@angular/material/table';
import { Category, GetCategoryService } from './get-category.service';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CreateCategoryComponent } from '../create-category/create-category.component';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { LoggedService } from '../logged.service';

@Component({
  selector: 'app-get-category',
  standalone: true,
  imports: [MatTableModule, MatDialogModule, MatButtonModule],
  templateUrl: './get-category.component.html',
  styleUrl: './get-category.component.css'
})
export class GetCategoryComponent {

  constructor(private getCategory: GetCategoryService, private dialogRef: MatDialog, private router: Router, private loggedService: LoggedService){}

  category: Category[] = [];
  displayedColumns: string[] = ['category_name', 'actions'];

  successMessage = signal('');
  errorMessage = signal('');

  user = signal<boolean>(false);
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
        
        this.category = data;
        console.log(this.category);
        //On vérifie si l'utilisateur est bien un mebre du staff
        this.user.set(this.loggedService.isStaff());
        
      },
      error: (err) => {
        console.error(err);
      }
    });

  }


viewAllMusicCategory(id: number){
  this.router.navigate(["/get_all_music_category", id]);
}



deleteCategory(id: number) {

  this.getCategory.deleteCategory(id).subscribe({
    next: (res) => {
       this.successMessage.set('La catégorie à bien été supprimer avec succès.');
       this.category = this.category.filter(
        category => category.id !== id
       );
    }
  })
  console.log(id);
}




}
