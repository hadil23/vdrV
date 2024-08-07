import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { VirtualDataRoomComponent } from '../virtual-data-room/virtual-data-room.component';
import { VirtualRoomService } from '../services/virtual-room.service';

@Component({
  selector: 'app-add-section-dialog',
  standalone: true,
  templateUrl: './add-section-dialog.component.html',
  styleUrls: ['./add-section-dialog.component.scss'],
  imports: [
    MatFormFieldModule,
    VirtualDataRoomComponent,
    MatInputModule,
    MatDialogModule,
    FormsModule
  ]
})
export class AddSectionDialogComponent {
  newPanelTitle: string = '';

  constructor(public dialogRef: MatDialogRef<AddSectionDialogComponent> , private virtualRoomService:VirtualRoomService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  private panelId!: string; 

  createPanel(): void {
    this.virtualRoomService.getVirtualRoomId().subscribe(virtualRoomId => {
      console.log('Virtual Room ID:', virtualRoomId);
      if (virtualRoomId === null) {
        console.error('LID de la salle virtuelle est null');
      } else {
        const panelTitle = this.newPanelTitle.trim();
        console.log('Panel Title:', panelTitle);
        if (panelTitle !== '') {
          this.virtualRoomService.createPanel(virtualRoomId.toString(), panelTitle).subscribe(
            response => {
              console.log('Panel créé avec succès :', response);
              this.panelId = response.id; // store the panel ID
            },
            error => {
              console.error('Erreur lors de la création du panel :', error);
            }
          );
        } else {
          console.error('Le titre du panel est vide');
        }
      }
    });
  }
}
