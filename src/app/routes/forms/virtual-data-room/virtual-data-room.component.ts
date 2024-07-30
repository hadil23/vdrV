import { ChangeDetectionStrategy, Component, inject, signal, OnInit, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Importez MatDialogModule ici
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { NzDemoUploadBasicComponent } from '../nz-demo-upload-basic/nz-demo-upload-basic.component';
import { DraftService } from '../services/draft.service';
import { VirtualRoomService } from '../services/virtual-room.service';
import { CloudinaryService } from '../services/CloudinaryService';
import { AddSectionDialogComponent } from '../add-section-dialog/add-section-dialog.component'; // Assurez-vous que ce chemin est correct
import { Panel } from '../models/panel';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common'; 
import { AddNewGuestComponent } from '../add-new-guest/add-new-guest.component';

import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDrawerService } from 'ng-zorro-antd/drawer';

import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';

export enum Permission {
  NoAccess = 'No Access',
  OnlyView = 'Only View',
  Download = 'Download',
  Edit = 'Edit'
}

@Component({
  selector: 'app-virtual-data-room',
  standalone: true,
  imports: [
    MatExpansionModule,
    NzDrawerModule,
    CommonModule,
    NzDemoUploadBasicComponent,
    MatDialogModule, 
    DragDropModule,
    FormsModule, 
    MatFormFieldModule, 
    AddSectionDialogComponent,
    MatInputModule,
  ],
  providers:[NzDrawerService],
  templateUrl: './virtual-data-room.component.html',
  styleUrls: ['./virtual-data-room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualDataRoomComponent implements OnInit {
  panelOpenState = signal(false);
  @ViewChild('addPanelDialog') addPanelDialog: any;
  newPanelTitle: string = '';

  @Input() virtualDataRoomTitle: string = '';
  @Input() access: string = '';
  @Input() defaultGuestPermission: Permission = Permission.Download; 





  panels = signal<Panel[]>([
    { id: '1', title: 'Legal Documents', files: [] , expanded: false},
    { id: '2', title: 'Financial Documents', files: [] , expanded: false},
    { id: '3', title: 'Products', files: [] ,expanded: false},
    { id: '4', title: 'Intellectual Property', files: [],expanded: false }
  ]);
 

private nzDrawerService = inject (NzDrawerService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private draftService = inject(DraftService);
  private activatedRoute = inject(ActivatedRoute);
  private virtualRoomService = inject(VirtualRoomService);
  private cloudinaryService = inject(CloudinaryService);
  private cd= inject(ChangeDetectorRef);
  userId = '17';
  panel: any;
  
 

  
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const virtualRoomIdString = this.activatedRoute.snapshot.paramMap.get('id');
  
      if (virtualRoomIdString) {
        const virtualRoomId = parseInt(virtualRoomIdString, 10);
  
        if (!isNaN(virtualRoomId)) {
          this.virtualRoomService.getVirtualDataRoom(virtualRoomId).subscribe((virtualDataRoom) => {
            console.log('Data received from API:', virtualDataRoom);  // Pour vérifier les données reçues
  
            if (virtualDataRoom) {
              this.virtualDataRoomTitle = virtualDataRoom.title || '';
              this.access = virtualDataRoom.access || '';
              this.defaultGuestPermission = this.mapPermission(virtualDataRoom.defaultGuestPermission);
              this.virtualRoomService.setVirtualRoomId(virtualRoomId);
            } else {
              console.error('No data received for virtualRoomId:', virtualRoomId);
            }
          }, error => {
            console.error('Error fetching virtual data room:', error);
          });
        } else {
          console.error('Invalid virtualRoomId:', virtualRoomIdString);
        }
      } else {
        console.error('No virtualRoomId in route params');
      }
    });
  }
  private mapPermission(permission: string): Permission {
    switch (permission?.toLowerCase()) {
      case 'download':
        return Permission.Download;
      case 'edit':
        return Permission.Edit;
      case 'onlyview':
        return Permission.OnlyView;
      default:
        return Permission.NoAccess;
    }
  }
  
  
  
 
  
  
 
  
  createPanel(): void {
    this.virtualRoomService.getVirtualRoomId().subscribe(vdrId => {
      console.log('Virtual Room ID:', vdrId);
      if (vdrId !== null) {
        const panelTitle = this.newPanelTitle.trim();
        console.log('Panel Title:', panelTitle);
        if (panelTitle !== '') {
          this.virtualRoomService.createPanel(vdrId.toString(), panelTitle).subscribe(
            response => {
              console.log('Panel créé avec succès :', response);
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
  

  addFileToPanel(panel: any, event: NzUploadChangeParam): void {
    console.log('addFileToPanel called with panel:', panel);
    console.log('addFileToPanel called with event:', event);

    if (!this.canEdit()) {
      alert('Denied permission...');
      return;
    }

    const preset = 'ml_default';
    const userId = '17';
    const panelId = panel.id;

    if (event.fileList) {
      for (const file of event.fileList) {
        if (file.originFileObj) {
          const fileObject = file.originFileObj as File;
          console.log('Uploading file:', fileObject.name);

          this.cloudinaryService.uploadFile(fileObject, preset)
            .then((result) => {
              console.log('File uploaded to Cloudinary:', result);

              const fileUrl = result.secure_url;
              console.log('File URL:', fileUrl);

              this.virtualRoomService.saveFileUrlToDatabase(fileUrl, userId, panelId)
                .subscribe((response) => {
                  console.log('File URL saved to database successfully:', response);
                }, (error) => {
                  console.error('Error saving file URL to database:', error);
                });
            })
            .catch((error) => {
              console.error('Error uploading file to Cloudinary:', error);
            });
        }
      }
    }
  }

 


 

  

  canEdit(): boolean {
    return this.defaultGuestPermission === Permission.Edit;
  }




  canDownloadFiles(): boolean {
    console.log('Checking download permission:', this.defaultGuestPermission);
    return this.defaultGuestPermission === Permission.Download || this.defaultGuestPermission === Permission.Edit;
  }

  downloadAllFiles(): void {
    if (!this.canDownloadFiles() && this.defaultGuestPermission!== Permission.Download && this.defaultGuestPermission!== Permission.Edit) {
      alert('Denied permission to download files.');
      return;
    }
  
    const zip = new JSZip();
    const downloadPromises: Promise<void>[] = [];
  
    this.panels().forEach((panel) => {
      panel.files.forEach((file) => {
        downloadPromises.push(
          fetch(file.url)
            .then(response => response.blob())
            .then((blob) => {
              const fileName = file.url.substring(file.url.lastIndexOf('/') + 1);
              zip.file(fileName, blob);
            })
            .catch((error) => {
              console.error('Error downloading file:', error);
            })
        );
      });
    });
  
    Promise.all(downloadPromises).then(() => {
      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, 'virtual_data_room.zip');
      });
    }).catch((error) => {
      console.error('Erreur lors de la création du fichier zip :', error);
    });
  }
  

  addNewSection(): void {
    if (!this.canEdit()) {
      alert('Denied permission...');
      return;
    }

    const dialogRef = this.dialog.open(AddSectionDialogComponent, {
      width: '250px',
      data: { title: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.newPanelTitle = result;
        this.panels.update(panels => [...panels, { id: Date.now().toString(), title: result, files: [] ,expanded: false}]);
        
        this.cd.detectChanges();
      }
    });
  }
  
isDialogOpen = false;



  openAddGuestDialog(): void {
    this.isDialogOpen = true;
    const dialogRef = this.dialog.open(AddNewGuestComponent, {
      width: '300px',
      panelClass: 'small-dialog',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.isDialogOpen = false;
    });
  }
 
 
 
 
  saveChanges(): void {
    if (!this.canEdit()) {
      alert('Denied permission...');
      return;
    }

    console.log('Changes saved successfully');
  }


  goToAddNewGuest(access: string): void {
    this.router.navigate(['/add-new-guest'], { queryParams: { 
      access: access, 
      permissionParam : this.defaultGuestPermission ,
      title :  this.virtualDataRoomTitle 
    } });
  }
  
}   