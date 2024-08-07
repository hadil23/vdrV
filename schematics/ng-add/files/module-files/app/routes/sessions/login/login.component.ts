import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from 'app/routes/sessions/register/auth.service'; // Assurez-vous d'ajouter le bon chemin

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    MatProgressSpinnerModule,
  ]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]], // Changement de `username` à `email`
    password: ['', [Validators.required]],
    rememberMe: [false]
  });

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe');
  }

  isSubmitting = false;

  login() {
    this.isSubmitting = true;
  
    const email = this.email?.value?.trim() ?? ''; // Supprimer les espaces superflus
    const password = this.password?.value?.trim() ?? '';
  
    if (this.loginForm.valid) {
      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          this.router.navigateByUrl('/forms/home');
        },
        error: (error) => {
          console.error('Login failed', error);
          this.isSubmitting = false;
        }
      });
    } else {
      console.error('Email and password are required');
      this.isSubmitting = false;
    }
  }
  
}
