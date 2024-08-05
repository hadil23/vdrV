import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VirtualRoomService } from '../services/virtual-room.service';
import { Router } from '@angular/router';

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
    CommonModule,
    MatCheckboxModule,
    MatMenuModule,
    ReactiveFormsModule,
    FormsModule
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

  editDataRoom(room: VirtualDataRoom): void {
    console.log('Edit Data Room:', room);
  }

  addDataRoom(room: VirtualDataRoom): void {
    console.log('Add Data Room:', room);
  }

  viewDataRoom(room: VirtualDataRoom): void {
    console.log('View Data Room:', room);
  }

  getDataRoomLink(room: VirtualDataRoom): void {
    console.log('Get Data Room Link:', room);
  }

  manageAccess(room: VirtualDataRoom): void {
    console.log('Manage Access:', room);
  }

  deleteDataRoom(room: VirtualDataRoom): void {
    const index = this.virtualDataRooms.indexOf(room);
    if (index >= 0) {
      this.virtualDataRooms.splice(index, 1);
    }
  }

  navigateToVirtualDataRoom(id: number): void {
    this.router.navigate(['/forms/virtual-data-room', id]);
  }
}
