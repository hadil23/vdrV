import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface User {
    id?: number; 
    name: string;
    email: string;
    password: string; 
    role?: string; 
   
  }

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl =" http://localhost:3000/api/users";
  private backenUrl = `${this.apiUrl}`; 

  constructor(private http: HttpClient) {}

  // Inscription de l'utilisateur
  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.backenUrl}`, user).pipe(
      tap((newUser: User) => console.log(`Utilisateur enregistré avec l'ID=${newUser.id}`)),
      catchError(this.handleError<User>('register'))
    );
  }

  // Connexion de l'utilisateur
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.backenUrl}/login`, { email, password }).pipe(
      tap(response => console.log('Connexion réussie')),
      catchError(this.handleError<any>('login'))
    );
  }

  // Vérifier si l'utilisateur est authentifié
  isLoggedIn(): boolean {
    // Implémentez la logique pour vérifier si l'utilisateur est authentifié
    // Exemple : vérifiez la présence d'un token dans le stockage local
    return !!localStorage.getItem('authToken');
  }

  // Méthode d'erreur générique
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} échoué: ${error.message}`);
      return of(result as T);
    };
  }
}
