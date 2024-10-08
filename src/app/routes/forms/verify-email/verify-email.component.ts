import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { PageHeaderComponent } from '@shared';
import { ToastrService } from 'ngx-toastr';
import { VerifyEmailService } from '../services/verify-email-service.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    FormlyModule,
    PageHeaderComponent,
    RouterModule
  ],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  private readonly toast = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly verifyEmailService = inject(VerifyEmailService);

  form = new FormGroup({});
  model = { email: '', code: '' };
  fields: FormlyFieldConfig[] = [
    {
      key: 'code',
      type: 'input',
      templateOptions: {
        label: 'Code',
        placeholder: 'Type here your verification code ..',
        required: true,
      },
    },
    {
      key: 'email',
      type: 'input',
      templateOptions: {
        label: 'Email address',
        placeholder: 'Enter email',
        required: true,
      },
    },
  ];

  email: string = '';
  code: string = '';
  verificationMessage: string = '';
  virtualDataRoomId: string = '';
  virtualDataRoomTitle = '';

  permissionParam = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.virtualDataRoomId = params['id'];
      this.virtualDataRoomTitle = params['title'];
      this.email = params['email'];
      this.code = params['code'];
      this.permissionParam = params['defaultGuestPermission'];
      console.log(`Virtual Data Room ID: ${this.virtualDataRoomId}`);
      console.log(`Email: ${this.email}`);
      console.log(`Code: ${this.code}`);
    });
  }

  verifyEmail() {
    console.log('Virtual Data Room ID:', this.virtualDataRoomId);

    if (this.virtualDataRoomId) {
      this.verifyEmailService.verifyEmail(this.email, this.code ,this.virtualDataRoomId)
        .subscribe(
          response => {
            this.verificationMessage = response.message || 'Verification successful';
            this.navigateToVirtualDataRoom(this.virtualDataRoomId);
          },
          error => {
            console.error('Error verifying email:', error);
            this.verificationMessage = 'Server error';
          }
        );
    } else {
      console.error('virtualDataRoomId is undefined');
      this.verificationMessage = 'Virtual Data Room ID is undefined';
    }
  }

  navigateToVirtualDataRoom(virtualDataRoomId: string) {
    this.router.navigate(['/auth/guest-room'], { queryParams: { id: virtualDataRoomId, title: this.virtualDataRoomTitle } });
  }

  showToast(message: string): void {
    this.toast.success(message);
  }
}
