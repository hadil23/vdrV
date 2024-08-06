import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

export interface DialogData {
  fileName: string;
}

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './alert-dialog.component.html',
})
export class AlertDialogComponent {
  constructor(
    private router : Router,
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string })
   {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  navigateToVirtualDataRoom(virtualDataRoomId: string) {
    this.router.navigate(['/forms/virtual-data-room'], { queryParams: { id: virtualDataRoomId } });
  }
}
