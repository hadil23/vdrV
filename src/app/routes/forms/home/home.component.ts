import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { VirtualRoomService } from '../services/virtual-room.service';
import { CardComponent } from '../../material/card/card.component';
import { ChatbotComponent } from '../chat-bot/chat-bot.component';
import { NzDrawerComponent } from 'ng-zorro-antd/drawer';
import { DrawerService } from '../services/drawerService';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

interface VirtualDataRoom {
  id: number;
  name: string; 
  createdAt :string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, CardComponent,ChatbotComponent,NzDrawerComponent,NzDrawerModule , MatCheckboxModule,MatMenuModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers:[NzDrawerService]
})
export class HomeComponent implements OnInit {
  virtualDataRooms: VirtualDataRoom[] = [];
  isChatbotVisible: boolean = false;
  clicked:boolean= false ;
  snackBar: any;

  constructor(private virtualRoomService: VirtualRoomService , private drawerService : DrawerService , private nzDrawerService : NzDrawerService , private router : Router) {}

  ngOnInit() {
    this.virtualRoomService.getAllVirtualDataRooms().subscribe((data: VirtualDataRoom[]) => {
      console.log('Virtual Data Rooms:', data); 
      this.virtualDataRooms = data;
    });
  }
  // Les liens vers les profils de réseaux sociaux
  githubUrl: string = 'https://github.com/';
  linkedinUrl: string = 'https://www.linkedin.com/';
  instagramUrl: string = 'https://www.instagram.com/';

  goToLink(url: string): void {
    window.open(url, '_blank'); // Ouvrir le lien dans un nouvel onglet
  }
  toggleChatbot(): void {
    this.isChatbotVisible = !this.isChatbotVisible;
  }

  openDrawer(): void {
    this.nzDrawerService.create({
      nzTitle: '',
      nzContent: ChatbotComponent,
      nzPlacement: 'bottom',
      nzClosable: true,
      nzWidth: 400,  
      nzHeight: '100vh',  
      nzWrapClassName: 'custom-drawer',
    });
  }
  navigateToVirtualDataRoom(id: number): void {
    this.router.navigate(['/forms/virtual-data-room'], { queryParams: { id: id } });
  }
  goToCreateVirtualRoom():void{
    this.router.navigate(['/forms/create-virtual-room'])

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

  
}
