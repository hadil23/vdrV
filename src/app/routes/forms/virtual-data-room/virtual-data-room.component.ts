import { ChangeDetectionStrategy, Component, inject, signal, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
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
    CommonModule,
    NzDemoUploadBasicComponent,
    MatDialogModule, 
    DragDropModule,
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule,
  ],
  templateUrl: './virtual-data-room.component.html',
  styleUrls: ['./virtual-data-room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualDataRoomComponent implements OnInit {
  panelOpenState = signal(false);
  @ViewChild('addPanelDialog') addPanelDialog: any;

  virtualDataRoomTitle = signal('');
  access = signal('');
  defaultGuestPermission = signal<Permission>(Permission.Download);
  expiryDate = signal<Date | null>(null);
  panels = signal<Panel[]>([
    { id: '1', title: 'Legal Documents', files: [] },
    { id: '2', title: 'Financial Documents', files: [] },
    { id: '3', title: 'Products', files: [] },
    { id: '4', title: 'Intellectual Property', files: [] }
  ]);

  newPanelTitle = signal('');
 

  private router = inject(Router);
  private dialog = inject(MatDialog);
  private draftService = inject(DraftService);
  private activatedRoute = inject(ActivatedRoute);
  private virtualRoomService = inject(VirtualRoomService);
  private cloudinaryService = inject(CloudinaryService);
  private cd= inject(ChangeDetectorRef);
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.virtualDataRoomTitle.set(params['title'] || '');
      const virtualRoomIdString = params['id'];
      const permissionParam = params['defaultGuestPermission'];

      if (permissionParam) {
        this.defaultGuestPermission.set(permissionParam as Permission);
      } else {
        this.defaultGuestPermission.set(Permission.NoAccess);
      }

      const virtualRoomId = parseInt(virtualRoomIdString, 10);
      if (!isNaN(virtualRoomId)) {
        this.virtualRoomService.setVirtualRoomId(virtualRoomId);
      } else {
        console.error('Invalid virtualRoomId:', virtualRoomIdString);
      }
    });
  }
 
  createPanel(): void {
    this.virtualRoomService.getVirtualRoomId().subscribe(vdrId => {
      if (vdrId !== null) {
        const panelTitle = this.newPanelTitle().trim();
        if (panelTitle !== '') {
          this.virtualRoomService.createPanel(vdrId.toString(), panelTitle).subscribe(
            response => {
              console.log('Panel créé avec succès :', response);
              this.panels.update(panels => [...panels, { id: response.id, title: panelTitle, files: [] }]);
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
  addPanel(): void {
    const dialogRef = this.dialog.open(AddSectionDialogComponent, {
      width: '250px'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Assurez-vous que l'objet ajouté respecte l'interface Panel
        const currentPanels = this.panels();
        this.panels.set([...currentPanels, { id: Date.now().toString(), title: result, files: [] }]);
      }
    });
  }
  
  

  openAddPanelDialog() {
    const dialogRef = this.dialog.open(this.addPanelDialog, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.panels.update(panels => [...panels, { id: Date.now().toString(), title: result, files: [] }]);
      }
    });
  }

  loadPanels(): void {
    fetch('/api/panels')
      .then(response => response.json())
      .then((panels: Panel[]) => {
        this.panels.set(panels);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des panels:', error);
      });
  }

  dropFile(panel: Panel, event: CdkDragDrop<File[]>) {
    const previousIndex = event.previousContainer.data.indexOf(event.item.data);
    const currentIndex = event.container.data.indexOf(event.item.data);

    if (previousIndex > -1 && currentIndex > -1) {
      this.moveItemInArray(panel.files, previousIndex, currentIndex);
    }
  }

  addFileToPanel(panel: any, files: FileList) {
    if (!this.canEdit()) {
      alert('Denied permission...');
      return;
    }

    const preset = 'ml_default';
    const userId = '17';
    const panelId = panel.id;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      this.cloudinaryService.uploadFile(file, preset)
        .then((result) => {
          console.log('File uploaded to Cloudinary:', result);

          const fileUrl = result.secure_url;

          fetch(`/api/files`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileUrl, userId, panelId })
          })
          .then(response => response.json())
          .then((response) => {
            console.log('File URL saved to database successfully:', response);
          })
          .catch((error) => {
            console.error('Error saving file URL to database:', error);
          });
        })
        .catch((error) => {
          console.error('Error uploading file to Cloudinary:', error);
        });
    }
  }

  getFilesForPanel(panelId: string): void {
    fetch(`/api/files?panel_id=${panelId}`)
      .then(response => response.json())
      .then((files: File[]) => {
        console.log(`Fichiers pour le panel avec l'ID ${panelId}:`, files);
      })
      .catch(error => {
        console.error(`Erreur lors de la récupération des fichiers pour le panel avec l'ID ${panelId}:`, error);
      });
  }

  canEdit(): boolean {
    return this.defaultGuestPermission() === Permission.Edit;
  }

  onEditClick(): void {
    if (!this.canEdit()) {
      alert('Denied permission...');
    } else {
      this.goToDraft();
    }
  }

  goToDraft(): void {
    this.draftService.saveVirtualDataRooms({
      title: this.virtualDataRoomTitle(),
      panels: this.panels()
    });
    this.router.navigate(['/edit']);
  }

  canDownloadFiles(): boolean {
    return this.defaultGuestPermission() === Permission.Download || this.defaultGuestPermission() === Permission.Edit;
  }

  downloadAllFiles(): void {
    if (!this.canDownloadFiles()) {
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
      this.newPanelTitle.set(result); // Assurez-vous que newPanelTitle est un signal
      this.panels.update(panels => [...panels, { id: Date.now().toString(), title: result, files: [] }]);
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
  moveItemInArray(array: any[], fromIndex: number, toIndex: number): void {
    const [removed] = array.splice(fromIndex, 1);
    array.splice(toIndex, 0, removed);
  }
 

  goToVirtualDataRoom() {
    if (this.virtualDataRoomTitle().trim() === '') {
      console.error('Le titre de la salle de données virtuelle est vide.');
      return;
    }

    this.router.navigate(['/forms/virtual-data-room'], {
      queryParams: {
        title: this.virtualDataRoomTitle(),
        id: this.virtualRoomService.getVirtualRoomId().toString(),
        defaultGuestPermission: this.defaultGuestPermission()
      }
    });
  }
  goToAddNewGuest(access: string): void {
    this.router.navigate(['forms/add-new-guest'], { queryParams: { access } });
  }
}
