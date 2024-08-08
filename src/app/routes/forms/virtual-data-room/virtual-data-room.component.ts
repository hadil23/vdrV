
import { ChangeDetectionStrategy, Component, inject, signal, OnInit, ViewChild, ChangeDetectorRef, Input, WritableSignal } from '@angular/core';
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
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { FormatFileNamePipe } from '../format-file-name.pipe' ; 
export enum defaultGuestPermission {
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
    NzIconModule,
    NzDemoUploadBasicComponent,
    MatDialogModule, 
    DragDropModule,
    FormsModule, 
    MatFormFieldModule, 
    AddSectionDialogComponent,
    MatInputModule,
    FormatFileNamePipe
  
  ],
  providers:[NzDrawerService ,FormatFileNamePipe],
  templateUrl: './virtual-data-room.component.html',
  styleUrls: ['./virtual-data-room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
 
})
export class VirtualDataRoomComponent implements OnInit {
  panelOpenState = signal(false);
  @ViewChild('addPanelDialog') addPanelDialog: any;
  newPanelTitle: string = '';

  virtualDataRoomTitle: string = '';
   access: string = '';
  defaultGuestPermission: defaultGuestPermission = defaultGuestPermission.Download; 
  viewCount: number | undefined;





 


  private drawerService = inject(NzDrawerService);

private nzDrawerService = inject (NzDrawerService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private draftService = inject(DraftService);
  private activatedRoute = inject(ActivatedRoute);
  private virtualRoomService = inject(VirtualRoomService);
  private cloudinaryService = inject(CloudinaryService);
  private cd= inject(ChangeDetectorRef);
  userId = '36';
  panel: any;

  virtualRoomId: any;

  paneles: Panel[] = [];

  panels: WritableSignal<Panel[]> = signal<Panel[]>([]);
  panells = signal<Panel[]>([
    { id: '1', title: 'Legal Documents', files: [], expanded: false },
    { id: '2', title: 'Financial Documents', files: [], expanded: false },
    { id: '3', title: 'Products', files: [], expanded: false },
    { id: '4', title: 'Intellectual Property', files: [], expanded: false }
  ]);

  get panelList(): Panel[] {
    return this.panels(); // Get the latest value from the signal
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



  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const virtualRoomIdString = params['id']; // Utilisez params['id'] pour accéder à l'id directement depuis les paramètres de requête
  
      if (virtualRoomIdString) {
        const virtualRoomId = parseInt(virtualRoomIdString, 10);
  
        if (!isNaN(virtualRoomId)) {
          this.virtualRoomService.getVirtualDataRoomById(virtualRoomId).subscribe((virtualDataRoom: any) => {
            console.log('Data received from API:', virtualDataRoom);
  
            if (virtualDataRoom) {
              this.virtualDataRoomTitle = virtualDataRoom.name || ''; // Assurez-vous d'utiliser le bon champ pour le titre
              this.access = virtualDataRoom.access || '';
              this.defaultGuestPermission = this.mapPermission(virtualDataRoom.defaultGuestPermission) || defaultGuestPermission.Download;
              this.virtualRoomService.setVirtualRoomId(virtualRoomId);
  
              this.virtualRoomService.getPanelsByVdrId(virtualRoomId).subscribe((panels: any) => {
                console.log('Panels data received from API:', panels);
                const formattedPanels = panels.map((panel: { id: any; name: any; }) => ({
                  id: panel.id,
                  title: panel.name,
                  files: []
                }));
  
                // Get files for each panel
                formattedPanels.forEach((panel: { id: number; files: any; }) => {
                  this.virtualRoomService.getFilesByPanelId(panel.id).subscribe((files: any) => {
                    console.log('Files data received from API:', files);
                    panel.files = files.map((file: { id: any; name: any; url: any; }) => ({
                      id: file.id,
                      name: file.name,
                      url: file.url
                    }));
                  }, error => {
                    console.error('Error fetching files:', error);
                  });
                });
  
                this.panels.set(formattedPanels);
              }, error => {
                console.error('Error fetching panels:', error);
              });
  
              // Appeler incrementViews après avoir récupéré toutes les données
              this.incrementViews();
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
  
  
  incrementViews(): void {
    if (this.virtualRoomId) {
      this.virtualRoomService.incrementViewCount(this.virtualRoomId).subscribe(
        response => {
          console.log('View count incremented:', response);
        },
        error => {
          console.error('Error incrementing view count:', error);
        }
      );
    }
    
  }
  
  EtafaknaUrl: string = 'https://www.e-tafakna.app/';
    goToLink(url: string): void {
    window.open(url, '_blank'); // Ouvrir le lien dans un nouvel onglet
  }
  
  /*getViewCount(id: number): void {
    this.virtualRoomService.getViewCount(id).subscribe((data: any) => {
      this.viewCount = data.viewCount;
    }, error => {
      console.error('Error fetching view count:', error);
    });
  }*/

  
  private panelId!: string; 

  createPanel(): void {
    this.virtualRoomService.getVirtualRoomId().subscribe(virtualRoomId => {
      console.log('Virtual Room ID:', virtualRoomId);
      if (virtualRoomId === null) {
        console.error('LID de la salle virtuelle est null');
      } else {
        const panelTitle = this.newPanelTitle.trim();
        console.log('Panel Title:', panelTitle);
        if (panelTitle !== '') {
          this.virtualRoomService.createPanel(virtualRoomId.toString(), panelTitle).subscribe(
            response => {
              console.log('Panel créé avec succès :', response);
              this.panelId = response.id; // store the panel ID
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

    addFileToPanel(panel: Panel, event: NzUploadChangeParam): void {
      console.log('addFileToPanel called with panel:', panel);
      console.log('addFileToPanel called with event:', event);
  
    
      if (!this.canEdit()) {
        alert('Denied permission...');
        return;
      }
  
    
      const preset = 'ml_default';
      const userId = '18';
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
  
                // only save the file URL to the database if the panel ID exists
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

 

  

  canEdit(): boolean {
    return this.defaultGuestPermission === defaultGuestPermission.Edit;
  }




  canDownloadFiles(): boolean {
    console.log('Checking download permission:', this.defaultGuestPermission);
    return this.defaultGuestPermission === defaultGuestPermission.Download || this.defaultGuestPermission === defaultGuestPermission.Edit;
  }

  downloadAllFiles(): void {
    if (!this.canDownloadFiles() && this.defaultGuestPermission!== defaultGuestPermission.Download && this.defaultGuestPermission!== defaultGuestPermission.Edit) {
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
    dialogRef.componentInstance.onInviteClick.subscribe(() => {
      dialogRef.close();
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
    this.router.navigate(['/forms/add-new-guest'], { queryParams: { 
      virtualRoomId :this.virtualRoomId,
      access: access, 
      permissionParam : this.defaultGuestPermission ,
      title :  this.virtualDataRoomTitle 
    } });
  }
  

  goToDraft(): void {
    const draft = {
      id: this.virtualRoomId,
      title: this.virtualDataRoomTitle
    };

    // Enregistrez le draft et effectuez la navigation
    this.router.navigate(['/forms/draft'], {
      queryParams: { id: this.virtualRoomId, title: this.virtualDataRoomTitle }
  })

  }
  
}


