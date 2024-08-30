import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, tap } from 'rxjs';

import { AuthService, SettingsService, User } from '@core';

@Component({
  selector: 'app-user',
  template: `
   
  `,
  styles: `
    .avatar {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50rem;
    }
  `,
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatMenuModule, TranslateModule],
})
export class UserComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly settings = inject(SettingsService);

  user!: User;

  ngOnInit(): void {
    this.auth
      .user()
      .pipe(
        tap(user => (this.user = user)),
        debounceTime(10)
      )
      .subscribe(() => this.cdr.detectChanges());
  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.router.navigateByUrl('/auth/login');
    });
  }

  restore() {
    this.settings.reset();
    window.location.reload();
  }
}
