import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-message-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButton],
  templateUrl: './message-dialog.component.html',
  styleUrl: './message-dialog.component.css'
})
export class MessageDialogComponent {

  data = inject<{message: string}>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef);
  private router = inject(Router);

  closeDialog() {
    this.dialogRef.close();
  }

}
