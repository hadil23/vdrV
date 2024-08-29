import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsRoutingModule } from 'app/routes/forms/forms.routes';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [RouterOutlet , FormsRoutingModule],
})
export class AuthLayoutComponent {}
