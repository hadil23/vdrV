import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-section-dialog',
  standalone: true,
  templateUrl: './add-section-dialog.component.html',
  styleUrls: ['./add-section-dialog.component.scss'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    FormsModule
  ]
})
export class AddSectionDialogComponent {
  newPanelTitle: string = '';

  constructor(public dialogRef: MatDialogRef<AddSectionDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
