import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { VirtualRoomService } from '../services/virtual-room.service';
import { BreadcrumbComponent } from '@shared';

@Component({
  selector: 'app-draft',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    BreadcrumbComponent
  ],
  templateUrl: './draft.component.html',
  styleUrls: ['./draft.component.scss']
})
export class DraftComponent implements OnInit {
  virtualDataRoomTitle: string = '';
  showProgress = false;
  virtualDataRooms: any;
  virtualRoomId: number | undefined;
  panels: any[] = [];
  files: any[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private virtualRoomService: VirtualRoomService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.virtualDataRoomTitle = params['title'];
      this.virtualRoomId = +params['id'];

      if (this.virtualRoomId) {
        this.loadVirtualDataRoom(this.virtualRoomId);
      }

      
    });
  }

  loadVirtualDataRoom(virtualRoomId: number) {
    this.virtualRoomService.getVirtualDataRoomById(virtualRoomId).subscribe(
      virtualDataRoom => {
        this.virtualDataRooms = virtualDataRoom;
        this.loadPanels(virtualRoomId);
      },
      error => {
        console.error('Error loading virtual data room', error);
      }
    );
  }

  loadPanels(vdrId: number) {
    this.virtualRoomService.getPanelsByVdrId(vdrId).subscribe(
      panels => {
        this.panels = panels;
        panels.forEach(panel => {
          this.loadFiles(panel.id);
        });
      },
      error => {
        console.error('Error loading panels', error);
      }
    );
  }

  loadFiles(panelId: number) {
    this.virtualRoomService.getFilesByPanelId(panelId).subscribe(
      files => {
        this.files = [...this.files, ...files];
      },
      error => {
        console.error('Error loading files', error);
      }
    );
  }

  getFilesForPanel(panelId: number): any[] {
    return this.files.filter(f => f.panelId === panelId);
  }

  deleteVirtualDataRoom() {
    if (this.virtualRoomId) {
      this.virtualRoomService.deleteVirtualDataRoom(this.virtualRoomId).subscribe(
        response => {
          this.openSnackbar('Virtual Data Room deleted successfully');
        },
        error => {
          console.error('Error deleting virtual data room', error);
        }
      );
    }
  }

  deletePanel(panelId: number) {
    this.virtualRoomService.deletePanel(panelId).subscribe(
      response => {
        this.panels = this.panels.filter(panel => panel.id !== panelId);
        this.openSnackbar('Panel deleted successfully');
      },
      error => {
        console.error('Error deleting panel', error);
      }
    );
  }

  deleteFile(fileId: number) {
    this.virtualRoomService.deleteFile(fileId).subscribe(
      response => {
        this.files = this.files.filter(file => file.id !== fileId);
        this.openSnackbar('File deleted successfully');
      },
      error => {
        console.error('Error deleting file', error);
      }
    );
  }

  openSnackbar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }
}
