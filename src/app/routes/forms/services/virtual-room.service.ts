import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Panel } from '../models/panel';
import { VirtualDataRoom } from '../models/virtual-data-room';

@Injectable({
  providedIn: 'root'
})
export class VirtualRoomService {

  

  private backendUrl = 'http://localhost:3000';
  private virtualRoomIdSubject: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null); // Initialisation de virtualRoomIdSubject
  panelIdSubject: any;

  constructor(private http: HttpClient) { }

  createVirtualDataRoom(virtualRoomData: any): Observable<any> {
    const url = `${this.backendUrl}/api/virtualDataRooms/virtualDataRooms`;
    console.log('Sending request to create virtual data room:', url, virtualRoomData); // Log the request
    return this.http.post<any>(url, virtualRoomData);
  }

  getVirtualRoomId(): Observable<number | null> {
    return this.virtualRoomIdSubject.asObservable();
  }
  createPanel(vdrId: string, name: string): Observable<any> {
    const url = `${this.backendUrl}/api/panel`;
    const panelData = { vdrId, name };
    return this.http.post<any>(url, panelData);
  }
  // Méthode pour récupérer l'ID de la salle virtuelle en tant qu'observable
 

  setVirtualRoomId(virtualRoomId: number): void {
    this.virtualRoomIdSubject.next(virtualRoomId);
  }

 
  addPanel(panelData: any): Observable<any> {
    const url = `${this.backendUrl}/api/panel/`;
    return this.http.post<any>(url, panelData);
  }
  getVirtualDataRoomById(virtualDataRoomId: number): Observable<any> {
    return this.http.get(`${this.backendUrl}/api/virtualDataRooms/${virtualDataRoomId}`);
  }
  getAllVirtualDataRooms(): Observable<any[]> {
    const url = `${this.backendUrl}/api/virtualDataRooms`;
    return this.http.get<any[]>(url);
  }

  getPanelId(): Observable<string | null> {
    return this.panelIdSubject.asObservable();
  }

  setPanelId(panelId: string): void {
    this.panelIdSubject.next(panelId);
  }
// virtual-room.service.ts
addPanelToVirtualDataRoom(virtualRoomId: string, panelData: any): Observable<any> {
  // Ajouter l'identifiant de la salle de données virtuelle aux données du panel
  panelData.virtualRoomId = virtualRoomId;

  // Envoyer une requête POST à l'URL de création de panel
  const url = `${this.backendUrl}/api/virtualDataRooms/savePanels`;
  return this.http.post<any>(url, panelData);
}


  savePanelsToDatabase(virtualRoomId: number, panels: Panel[]): Observable<any> {
    const data = {
      virtualRoomId: virtualRoomId,
      panels: panels
    };

    const url = `${this.backendUrl}/api/virtualDataRooms/savePanels`;
    return this.http.post<any>(url, data);
  }
  // virtual-room.service.ts
  uploadFilesToPanel(panelId: string, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file, file.name);
    });

    const url = `${this.backendUrl}/api/files`;
    return this.http.post<any>(url, formData);
  }
  saveFileUrlToDatabase(fileUrl: string, userId: string, panelId: string): Observable<any> {
    const url = `${this.backendUrl}/api/files`;
    return this.http.post<any>(url, { url: fileUrl, user_id: userId, panel_id: panelId });
  }
  
  checkInvitationTab(): Observable<any> {
    const url = `${this.backendUrl}/api/invitations/getAllInvitationsWithStatus`;
    return this.http.get<any>(url);
  }

  getFilesByPanelId(panelId: number): Observable<any[]> {
    const url = `${this.backendUrl}/api/files/file/${panelId}`;
    return this.http.get<any[]>(url);
  }

  getPanelsByVdrId(vdrId: number): Observable<any[]> {
    const url = `${this.backendUrl}/api/virtualDataRoom/${vdrId}/panels`; 
    return this.http.get<any[]>(url);
  }

  deleteVirtualDataRoom(vdrId: number): Observable<any> {
    const url = `${this.backendUrl}/api/virtualDataRooms/virtualDataRooms/${vdrId}`;
    return this.http.delete<any>(url);
  }

  deletePanel(panelId: number): Observable<any> {
    const url = `${this.backendUrl}/api/panel/${panelId}`;
    return this.http.delete<any>(url);
  }

  deleteFile(fileId: number): Observable<any> {
    const url = `${this.backendUrl}/api/files/${fileId}`;
    return this.http.delete<any>(url);
  }
  getViewCount(id: number): Observable<any> {
    return this.http.get(`${this.backendUrl}/api/virtualDataRooms/${id}/viewCount`);
  }

  incrementViewCount(id: number): Observable<any> {
    const url = `${this.backendUrl}/api/virtualDataRooms/${id}/view`; // Assurez-vous que backendUrl est correctement défini
    console.log('URL being called:', url); // Vérifiez cette URL
    return this.http.put(url, {});
  }
  

  updateVirtualDataRoom(id: number, updates: any): Observable<any> {
    const url = `${this.backendUrl}/api/virtualDataRooms/virtualDataRooms/${id}`;
    return this.http.put<any>(url, updates);
  }
 
  updatePanel(panelId: number, updates: any): Observable<any> {
    const url = `${this.backendUrl}/api/panel/${panelId}`;
    return this.http.put<any>(url, updates );
  }
}

