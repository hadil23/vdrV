
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // Optional
import { CommonModule } from '@angular/common';

interface DataRoom {
  selected?: boolean;
  name: string;
  owner: string;
  views: number;
  date: string;
  status: string;
}

@Component({
  selector: 'app-manage-data-rooms',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatCheckboxModule, MatMenuModule, ReactiveFormsModule, FormsModule],
  templateUrl: './manage-data-rooms.component.html',
  styleUrls: ['./manage-data-rooms.component.scss']
})
export class ManageDataRoomsComponent implements OnInit {
  status: string = '';
  searchQuery = '';

  @Input() dataRooms: DataRoom[] = []; // Receive dataRooms from parent component (optional)

  sortBy: string = 'newest';

  constructor() { }

  ngOnInit(): void {
    this.initializeDataRooms();
    this.sortDataRooms(this.sortBy);
  }

  initializeDataRooms() {
    // Provide initial data if not received from parent component
    if (!this.dataRooms || !this.dataRooms.length) {
      this.dataRooms = [
        { name: 'E-tafakna', owner: 'Norchen', views: 100, date: '2024-04-28', status: 'draft' },
        { name: 'Tekupers', owner: 'Khaled', views: 100, date: '2024-04-28', status: 'send' },
        { name: 'E-tafakna', owner: 'Norchen', views: 100, date: '2024-04-28', status: 'draft' },
        { name: 'Tekupers', owner: 'Khaled', views: 100, date: '2024-04-28', status: 'send' },
        { name: 'E-tafakna', owner: 'Norchen', views: 100, date: '2024-04-28', status: 'draft' },
        { name: 'Tekupers', owner: 'Khaled', views: 100, date: '2024-04-28', status: 'send' }
      ];
    }
  }

  filterDataRooms() {
    if (this.searchQuery) {
      this.dataRooms = this.dataRooms.filter(room =>
        room.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        room.owner.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.initializeDataRooms();
    }
  }

  sortDataRooms(sortBy: string) {
    this.sortBy = sortBy;
    switch (sortBy) {
      case 'newest':
        this.dataRooms.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'oldest':
        this.dataRooms.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'views':
        this.dataRooms.sort((a, b) => a.views - b.views);
        break;
      case 'owner':
        this.dataRooms.sort((a, b) => a.owner.localeCompare(b.owner));
        break;
      default:
        break;
    }
  }

  selectAll(event: Event) {
    if (this.dataRooms) {
      const isChecked = (event.target as HTMLInputElement).checked;
      this.dataRooms.forEach(room => room.selected = isChecked);
    }
  }

  editDataRoom(index: number) {
    console.log('Edit Data Room:', this.dataRooms[index]);
  }

  addDataRoom(index: number) {
    console.log('Add Data Room:', this.dataRooms[index]);
  }

  viewDataRoom(index: number) {
    console.log('View Data Room:', this.dataRooms[index]);
  }

  getDataRoomLink(index: number) {
    console.log('Get Data Room Link:', this.dataRooms[index]);
  }

  manageAccess(index: number) {
    console.log('Manage Access:', this.dataRooms[index]);
  }

  deleteDataRoom(index: number) {
    if (this.dataRooms) {
      this.dataRooms.splice(index, 1);
    }
  }
}






