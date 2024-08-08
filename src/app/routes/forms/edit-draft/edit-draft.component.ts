import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VirtualRoomService } from '../services/virtual-room.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { catchError, forkJoin, of, tap } from 'rxjs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { FormatFileNamePipe } from '../format-file-name.pipe';
import { Panel } from '../models/panel';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { defaultGuestPermission } from '../virtual-data-room/virtual-data-room.component';
import { CloudinaryService } from '../services/CloudinaryService';
import JSZip from 'jszip';
import { NzDemoUploadBasicComponent } from '../nz-demo-upload-basic/nz-demo-upload-basic.component';

interface VirtualDataRoom {
  id: number;
  name: string;
  access: string;
  defaultGuestPermission: string;
}

@Component({
  selector: 'app-edit-draft',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatExpansionModule,
    MatListModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    FormatFileNamePipe,
    NzDemoUploadBasicComponent
  ],
  templateUrl: './edit-draft.component.html',
  styleUrls: ['./edit-draft.component.scss'],
  providers:[FormatFileNamePipe],
})
export class EditDraftComponent implements OnInit {
  virtualDataRoomTitle: string = '';
  access: string = '';
  panels: any[] = [];
  selectedPanel: number | null = null;
  selectedFile: number | null = null;
  virtualRoomId: any;
  editingVirtualDataRoomTitle = false;
  editingPanelTitle: { [key: number]: boolean } = {};
  private panelId!: string;
  defaultGuestPermission: defaultGuestPermission = defaultGuestPermission.Download;
  newTitle: string = ''; 
  private cloudinaryService = inject(CloudinaryService);
  expiryDateTime: string ='';

  constructor(
    private activatedRoute: ActivatedRoute,
    private virtualRoomService: VirtualRoomService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const virtualRoomIdString = params['id'];

      if (virtualRoomIdString) {
        const virtualRoomId = +virtualRoomIdString;

        if (!isNaN(virtualRoomId)) {
          this.virtualRoomService.getVirtualDataRoomById(virtualRoomId).subscribe({
            next: (virtualDataRoom: any) => {
              if (virtualDataRoom) {
                this.virtualDataRoomTitle = virtualDataRoom.name || '';
                this.access = virtualDataRoom.access || '';
                this.defaultGuestPermission = this.mapPermission(virtualDataRoom.defaultGuestPermission) || 'Download';
                this.virtualRoomId = virtualRoomId;
                this.virtualRoomService.setVirtualRoomId(virtualRoomId);

                this.virtualRoomService.getPanelsByVdrId(virtualRoomId).subscribe({
                  next: (panels: any) => {
                    const formattedPanels = panels.map((panel: { id: any; name: any; }) => ({
                      id: panel.id,
                      title: panel.name,
                      files: []
                    }));

                    const fileRequests = formattedPanels.map((panel: { id: number; files: any; }) =>
                      this.virtualRoomService.getFilesByPanelId(panel.id).pipe(
                        tap((files: any) => {
                          panel.files = files.map((file: { id: any; name: any; url: any; }) => ({
                            id: file.id,
                            name: file.name,
                            url: file.url
                          }));
                        }),
                        catchError(error => {
                          console.error('Error fetching files:', error);
                          return of([]);
                        })
                      )
                    );

                    forkJoin(fileRequests).subscribe({
                      next: () => {
                        this.panels = formattedPanels;
                      },
                      error: error => {
                        console.error('Error combining file requests:', error);
                        this.snackBar.open('Failed to fetch files', 'Close', { duration: 3000 });
                      }
                    });
                  },
                  error: error => {
                    console.error('Error fetching panels:', error);
                    this.snackBar.open('Failed to fetch panels', 'Close', { duration: 3000 });
                  }
                });
              } else {
                console.error('Virtual Data Room not found');
                this.snackBar.open('Virtual Data Room not found', 'Close', { duration: 3000 });
              }
            },
            error: error => {
              console.error('Error fetching virtual data room:', error);
              this.snackBar.open('Failed to fetch virtual data room', 'Close', { duration: 3000 });
            }
          });
        } else {
          console.error('Invalid virtualRoomId:', virtualRoomIdString);
          this.snackBar.open('Invalid Virtual Room ID', 'Close', { duration: 3000 });
        }
      } else {
        console.error('No virtualRoomId in route params');
        this.snackBar.open('No Virtual Room ID provided', 'Close', { duration: 3000 });
      }
    });
  }

  addFileToPanel(panel: Panel, event: NzUploadChangeParam): void {
    if (!this.canEdit()) {
      alert('Denied permission...');
      return;
    }

    const preset = 'ml_default';
    const userId = '36';

    if (event.fileList) {
      for (const file of event.fileList) {
        if (file.originFileObj) {
          const fileObject = file.originFileObj as File;

          this.cloudinaryService.uploadFile(fileObject, preset)
            .then((result) => {
              const fileUrl = result.secure_url;

              if (this.panelId) {
                this.virtualRoomService.saveFileUrlToDatabase(fileUrl, userId, this.panelId)
                  .subscribe((response) => {
                    console.log('File URL saved to database successfully:', response);
                  }, (error) => {
                    console.error('Error saving file URL to database:', error);
                  });
              }
            })
            .catch((error) => {
              console.error('Error uploading file to Cloudinary:', error);
            });
        }
      }
    }
  }

  private mapPermission(permission: string): defaultGuestPermission {
    switch (permission?.toLowerCase()) {
      case 'download':
        return defaultGuestPermission.Download;
      case 'edit':
        return defaultGuestPermission.Edit;
      case 'onlyview':
        return defaultGuestPermission.OnlyView;
      default:
        return defaultGuestPermission.NoAccess;
    }
  }

  canEdit(): boolean {
    return this.defaultGuestPermission === defaultGuestPermission.Edit;
  }

  canDownloadFiles(): boolean {
    return this.defaultGuestPermission === defaultGuestPermission.Download || this.defaultGuestPermission === defaultGuestPermission.Edit;
  }

  updateVirtualDataRoomTitle(): void {
    if (this.virtualRoomId) {
      const updateData: any = {};

      if (this.newTitle) updateData.name = this.newTitle;
      if (this.expiryDateTime) updateData.expiryDateTime = this.expiryDateTime;
      if (this.access) updateData.access = this.access;
      if (this.defaultGuestPermission) updateData.defaultGuestPermission = this.defaultGuestPermission;

      this.virtualRoomService.updateVirtualDataRoom(this.virtualRoomId, updateData)
        .subscribe({
          next: (response) => {
            console.log('VDR title updated successfully:', response);
            if (updateData.name) this.virtualDataRoomTitle = this.newTitle;
            this.snackBar.open('VDR title updated successfully', 'Close', { duration: 3000 });
          },
          error: (error) => {
            console.error('Error updating VDR title:', error);
            this.snackBar.open('Failed to update VDR title', 'Close', { duration: 3000 });
          }
        });
    } else {
      console.error('No VDR ID available for update');
    }
  }



  savePanelTitle(panel: any): void {
    this.editingPanelTitle[panel.id] = false;
    this.updatePanelTitle(panel.id, panel.title);
  }

  updatePanelTitle(panelId: number, newTitle: string): void {
    const panel = this.panels.find(p => p.id === panelId);
    if (panel) {
      this.virtualRoomService.updatePanel(panelId, { title: newTitle })
        .subscribe({
          next: (response) => {
            console.log('Panel title updated successfully:', response);
            panel.title = newTitle;
            this.snackBar.open(response.message, 'Close', { duration: 3000 });
          },
          error: (error) => {
            console.error('Error updating panel title:', error);
            this.snackBar.open('Failed to update panel title', 'Close', { duration: 3000 });
          }
        });
    } else {
      console.error('Panel not found for update');
    }
  }

}