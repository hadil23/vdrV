import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerifyEmailService {

  private apiUrl = 'http://localhost:3000/api'; // Assurez-vous que l'URL est correcte ici

  constructor(private http: HttpClient) { }

  verifyEmail(email: string, code: string , virtualDataRoomId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/test`, { email, code,virtualDataRoomId });
  }

  incrementViewCount(virtualDataRoomId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/virtualDataRooms/increment-view-count/${virtualDataRoomId}`, {});
  }
}
