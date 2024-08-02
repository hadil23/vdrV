import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { VirtualRoomService } from '../services/virtual-room.service';
import { CardComponent } from '../../material/card/card.component';

interface VirtualDataRoom {
  id: number;
  name: string;  // Changez 'VirtualDataRoomTitle' en 'name'
  // Ajoutez d'autres champs nécessaires ici
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, CardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  virtualDataRooms: VirtualDataRoom[] = [];

  constructor(private virtualRoomService: VirtualRoomService) {}

  ngOnInit() {
    this.virtualRoomService.getAllVirtualDataRooms().subscribe((data: VirtualDataRoom[]) => {
      console.log('Virtual Data Rooms:', data); 
      this.virtualDataRooms = data;
    });
  }
}
