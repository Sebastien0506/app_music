import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule} from '@angular/material/list';
import { Router, RouterLink } from '@angular/router';
import { MatBottomSheetRef, MatBottomSheet } from '@angular/material/bottom-sheet';


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

}
