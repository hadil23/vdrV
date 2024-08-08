import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService, User } from 'app/routes/sessions/register/auth.service'; // Assurez-vous d'importer le service correctement
import { HomeComponent } from 'app/routes/forms/home/home.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
   
  ],
})
export class RegisterComponent {
constructor (private router : Router) {}
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService); // Injectez le service AuthService
  profilePhoto: File | null = null;

  registerForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    role: ['', [Validators.required]],
    agree: [false, [Validators.requiredTrue]],
  });

  // Static validator
  static matchValidator(source: string, target: string) {
    return (control: AbstractControl) => {
      const formGroup = control as any;
      const sourceValue = formGroup.controls[source];
      const targetValue = formGroup.controls[target];
      return sourceValue && targetValue && sourceValue.value === targetValue.value
        ? null
        : { mismatch: true };
    };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const user: User = {
        name: this.registerForm.get('name')!.value ?? '',
        email: this.registerForm.get('email')!.value ?? '',
        password: this.registerForm.get('password')!.value ?? '',
        role: this.registerForm.get('role')!.value ?? '',
      };

      this.authService.register(user).subscribe({
        next: (newUser) => {
          console.log('Utilisateur enregistré', newUser);
          this.router.navigateByUrl('/login')
       
          // Rediriger ou afficher un message de succès
        },
        error: (error: any) => {
          console.error('Erreur lors de l\'inscription', error);
          // Afficher un message d'erreur
        }
      });
    }
  }
  goToHome():void {
    this.router.navigate(['/forms/home']);
  }
}


