import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrawerService {
  private drawerSubject = new Subject<void>();

  openDrawer() {
    this.drawerSubject.next();
  }

  get openDrawer$() {
    return this.drawerSubject.asObservable();
  }
}
