import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule} from '@angular/material/list';
import { Router, RouterLink } from '@angular/router';
import { MatBottomSheetRef, MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { UpdateDescriptionAndLinkComponent } from '../update-description-and-link/update-description-and-link.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [MatButtonModule, MatListModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

  
  constructor( private bottomSheet: MatBottomSheet){}
  private bottomSheetRef = inject(MatBottomSheetRef<AdminDashboardComponent>, {optional: true});
  private router = inject(Router);

  dialog = inject(MatDialog);

  openBottomSheet(): void {
    this.bottomSheet.open(AdminDashboardComponent);
  }

  goToAddMusic(): void {
    this.bottomSheetRef?.dismiss();
    this.router.navigate(["/add-music"]);
  }

  goToManageMusic(): void {
    this.bottomSheetRef?.dismiss()
    this.router.navigate(['manage-music']);
  }

  goToAllMusic(): void {
    this.bottomSheetRef?.dismiss();
    this.router.navigate(['/get_all_music']);
  }
  
  //On ouvre le dialog
  openDialog(): void {
    const dialogRef = this.dialog.open(UpdateDescriptionAndLinkComponent, {
      width: "700px",
      height: "700px"
    })
  }
}
