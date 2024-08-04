import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { VirtualRoomService } from '../services/virtual-room.service';
import { BreadcrumbComponent } from '@shared';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';


interface VirtualDataRoom {
  id: number;
  name: string; 
  createdAt :string;
 
}
@Component({
  selector: 'app-draft',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatCheckboxModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    BreadcrumbComponent
  ],
  templateUrl: './draft.component.html',
  styleUrls: ['./draft.component.scss']
})
export class DraftComponent implements OnInit {

  showProgress = false;
  virtualDataRooms: VirtualDataRoom[] = [];
 

  constructor(
    private virtualRoomService: VirtualRoomService , private snackBar: MatSnackBar ,private router: Router 
  ) {}

  ngOnInit(): void {
    this.virtualRoomService.getAllVirtualDataRooms().subscribe((data: VirtualDataRoom[]) => {
      console.log('Virtual Data Rooms:', data); 
      this.virtualDataRooms = data;
    }); 
}


deleteVirtualDataRoom(vdrId: number): void {
  this.virtualRoomService.deleteVirtualDataRoom(vdrId).subscribe({
    next: () => {
      this.snackBar.open('Virtual Data Room deleted successfully', 'Close', {
        duration: 3000
      });
      this.virtualDataRooms = this.virtualDataRooms.filter(vdr => vdr.id !== vdrId);
    },
    error: (err) => {
      console.error('Error deleting Virtual Data Room:', err);
      this.snackBar.open('Failed to delete Virtual Data Room', 'Close', {
        duration: 3000
      });
    }
  });
}
editVirtualDataRoom(vdrId: number): void {
  this.router.navigate(['/forms/edit-draft'], { queryParams: { id: vdrId } });
}

}