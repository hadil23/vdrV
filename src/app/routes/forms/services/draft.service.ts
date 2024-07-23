import { Injectable } from '@angular/core';
import { VirtualDataRoom } from '../models/virtual-data-room';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Panel } from '../models/panel';

@Injectable({
  providedIn: 'root'
})
export class DraftService {
  private virtualDataRooms: VirtualDataRoom[] = [];

  private drafts: any[] = [];
  private draftsSubject = new BehaviorSubject<any[]>(this.drafts);

  getDrafts() {
    return this.draftsSubject.asObservable();
  }

  saveDraft(draft: any) {
    this.drafts.push(draft);
    this.draftsSubject.next(this.drafts);
  }

  getDraftById(id: number) {
    return this.drafts.find(draft => draft.id === id);
  }
 

  saveVirtualDataRooms(dataRoom: VirtualDataRoom): void {
    this.virtualDataRooms.push(dataRoom);
    console.log('Data saved:', this.virtualDataRooms); // Vérifiez les données sauvegardées dans la console
  }
  

  getVirtualDataRooms(): VirtualDataRoom[] {
    return this.virtualDataRooms;
  }
  

  clearVirtualDataRooms(): void {
    this.virtualDataRooms = [];
  }
  updateVirtualDataRoom(updatedDataRoom: VirtualDataRoom): void {
    if (updatedDataRoom) {
        const index = this.virtualDataRooms.findIndex(dataRoom => dataRoom.title === updatedDataRoom.title);
        if (index !== -1) {
            // Mettre à jour les panels existants
            this.virtualDataRooms[index].panels = updatedDataRoom.panels.map(updatedPanel => {
                const existingPanel = this.virtualDataRooms[index].panels.find(panel => panel.title === updatedPanel.title);
                if (existingPanel) {
                    // Mettre à jour les fichiers existants dans le panel
                    updatedPanel.files.forEach(updatedFile => {
                        const existingFileIndex = existingPanel.files.findIndex(file => file === updatedFile);
                        if (existingFileIndex !== -1) {
                            existingPanel.files[existingFileIndex] = updatedFile;
                        } else {
                            // Ajouter un nouveau fichier s'il n'existe pas déjà
                            existingPanel.files.push(updatedFile);
                        }
                    });
    
                    // Supprimer les fichiers qui ne sont plus présents dans le panel mis à jour
                    existingPanel.files = existingPanel.files.filter(file => updatedPanel.files.includes(file));

                    // Supprimer le panel s'il est vide
                    if (existingPanel.files.length === 0) {
                        this.deletePanel(this.virtualDataRooms[index], existingPanel);
                    }

                    return existingPanel;
                } else {
                    // Ajouter un nouveau panel s'il n'existe pas déjà
                    return updatedPanel;
                }
            });
        } else {
            // Ajouter la salle de données virtuelle si elle n'existe pas déjà
            this.virtualDataRooms.push({ ...updatedDataRoom });
        }
    }
}

deletePanel(dataRoom: VirtualDataRoom, panelToDelete: Panel): void {
  dataRoom.panels = dataRoom.panels.filter(panel => panel !== panelToDelete);
}


 }



