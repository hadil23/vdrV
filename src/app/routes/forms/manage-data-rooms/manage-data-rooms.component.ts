import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VirtualRoomService } from '../services/virtual-room.service';
import { Router } from '@angular/router';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

interface VirtualDataRoom {
  id: number;
  name: string;
  createdAt: string;
  owner: string;
  views: number;
  selected: boolean;
  date: string | number | Date; 
}

@Component({
  selector: 'app-manage-data-rooms',
  standalone: true,
  imports: [
    MatIconModule,
    MatDialogModule,
    CommonModule,
    MatCheckboxModule,
    MatMenuModule,
    ReactiveFormsModule,
    FormsModule,
    AlertDialogComponent
  ],
  templateUrl: './manage-data-rooms.component.html',
  styleUrls: ['./manage-data-rooms.component.scss'],
  providers: [VirtualRoomService]
})
export class ManageDataRoomsComponent implements OnInit {
  status: string = '';
  searchQuery = '';
  virtualDataRooms: VirtualDataRoom[] = [];
  sortBy: string = 'newest';

  private readonly toast = inject(ToastrService);
  private readonly dialog = inject(MatDialog);
  constructor(private virtualRoomService: VirtualRoomService, private router: Router) {}

  ngOnInit(): void {
    this.fetchDataRooms();
  }

  fetchDataRooms(): void {
    this.virtualRoomService.getAllVirtualDataRooms().subscribe(
      (dataRooms: any[]) => { // Assurez-vous que `dataRooms` est du type correct ici
        this.virtualDataRooms = dataRooms.map(room => ({
          id: room.id,
          name: room.name,
          createdAt: room.createdAt,
          owner: room.owner || 'Hadil',
          views: room.views || 0, // Assurez-vous que `views` est toujours un nombre
          selected: false, // Initialiser `selected` à false
          date: room.createdAt // Assigner `createdAt` à `date`
        }));
        this.sortDataRooms(this.sortBy);
      },
      (error) => {
        console.error('Error fetching data rooms:', error);
      }
    );
  }

  filterDataRooms(): void {
    if (this.searchQuery) {
      this.virtualDataRooms = this.virtualDataRooms.filter(room =>
        room.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        room.owner.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.fetchDataRooms();
    }
  }

  sortDataRooms(sortBy: string): void {
    this.sortBy = sortBy;
    switch (sortBy) {
      case 'newest':
        this.virtualDataRooms.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'oldest':
        this.virtualDataRooms.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'views':
        this.virtualDataRooms.sort((a, b) => b.views - a.views);
        break;
      case 'owner':
        this.virtualDataRooms.sort((a, b) => a.owner.localeCompare(b.owner));
        break;
      default:
        break;
    }
  }

  selectAll(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.virtualDataRooms.forEach(room => room.selected = isChecked);
  }

  
  editDataRoom(id: number): void {
    this.router.navigate(['/forms/edit-draft' ,id], { queryParams: { id  } });
  }

  goToCreateVirtualRoom(): void {
    this.router.navigateByUrl('/forms/create-virtual-room');
  }

  viewDataRoom(room: VirtualDataRoom): void {
    console.log('View Data Room:', room);
  }

  getDataRoomLink(room: VirtualDataRoom): void {
    // Construisez l'URL avec les paramètres de requête
    const dataRoomUrl = `/forms/virtual-data-room?id=${room.id}`;
  
    // Construit l'URL complète
    const fullUrl = `http://localhost:4200${dataRoomUrl}`;
    
    console.log('Get Data Room Link:', fullUrl);
  
    // Si vous souhaitez, vous pouvez afficher le lien ou le copier dans le presse-papiers
    // Exemple pour copier dans le presse-papiers :
    navigator.clipboard.writeText(fullUrl).then(() => {
      console.log('Link copied to clipboard');
      this.openDialog('Link copied to clipboard succesufly');
    }).catch(err => {
      console.error('Failed to copy link: ', err);
      this.openDialog('Failed to copy link');
    });
  }

  manageAccess(room: VirtualDataRoom): void {
    console.log('Manage Access:', room);
  }

  deleteDataRoom(room: VirtualDataRoom): void {
    const index = this.virtualDataRooms.indexOf(room);
    if (index >= 0) {
      this.virtualDataRooms.splice(index, 1);
    };
    this.openDialog('are u sure you want to delete virtual data room?');
  }
 

  openDialog(message: string): void {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '250px',
      data: { message: message } // Pass the message to the dialog
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  navigateToVirtualDataRoom(id: number): void {
    this.router.navigate(['/forms/virtual-data-room', id], {
      queryParams: { id: id, name: name }
    })
  }
}
