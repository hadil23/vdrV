import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { VirtualRoomService } from '../services/virtual-room.service';
import { CardComponent } from '../../material/card/card.component';
import { ChatbotComponent } from '../chat-bot/chat-bot.component';
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { DrawerService } from '../services/drawerService';

interface VirtualDataRoom {
  id: number;
  name: string;
  createdAt: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    CardComponent,
    ChatbotComponent,
    NzDrawerModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [NzDrawerService]
})
export class HomeComponent implements OnInit {
  virtualDataRooms: VirtualDataRoom[] = [];
  isChatbotVisible: boolean = false;

  constructor(
    private virtualRoomService: VirtualRoomService,
    private drawerService: DrawerService,
    private nzDrawerService: NzDrawerService,
    private router: Router
  ) {}

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

  goToCreateVirtualRoom(): void {
    this.router.navigate(['/forms/create-virtual-room']);
  }

  deleteVirtualDataRoom(id: number): void {
    this.virtualRoomService.deleteVirtualDataRoom(id).subscribe({
      next: () => {
        Swal.fire({
          title: 'Virtual Data Room Deleted!',
          text: 'The virtual data room has been deleted successfully.',
          icon: 'success',
          background: '#f8f9fa',
          color: '#343a40',
          confirmButtonColor: '#007bff',
          showConfirmButton: true,
          confirmButtonText: 'Okay',
          timer: 5000,
          timerProgressBar: true
        });

        // If you need MatSnackBar functionality, you must inject MatSnackBar in the constructor and use it.
        // Example:
        // this.snackBar.open('Virtual Data Room deleted successfully', 'Close', {
        //   duration: 3000
        // });

        this.virtualDataRooms = this.virtualDataRooms.filter(vdr => vdr.id !== id);
      },
      error: (err) => {
        console.error('Error deleting Virtual Data Room:', err);
      }
    });
  }
}
