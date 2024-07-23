import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, ActivatedRoute } from '@angular/router';
import { PageHeaderComponent } from '@shared';
import { InvitationService } from '../services/invitation.service';

@Component({
  selector: 'app-add-new-guest',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    FormlyModule,
    PageHeaderComponent,
  ],
  templateUrl: './add-new-guest.component.html',
  styleUrls: ['./add-new-guest.component.scss']
})
export class AddNewGuestComponent implements OnInit {
  private readonly toast = inject(ToastrService);
  private readonly invitationService = inject(InvitationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  form = new FormGroup({});
  model = { email: '', firstName: '', lastName: '' };
  fields: FormlyFieldConfig[] = [
    {
      key: 'firstName',
      type: 'input',
      templateOptions: {
        label: 'First name',
        placeholder: '',
        required: true,
      },
    },
    {
      key: 'lastName',
      type: 'input',
      templateOptions: {
        label: 'Last name',
        placeholder: '',
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

  virtualDataRoomId: number =192;
  userId: number = 17;

  ngOnInit(): void {
    // Récupérer l'ID de la Virtual Data Room depuis les paramètres de l'URL
    this.route.queryParams.subscribe(params => {
      this.virtualDataRoomId = params['id'];
    });
  }

  submit(): void {
    if (this.form.valid) {
      const invitationData = {
        ...this.model,
        userId: this.userId,
        virtualDataRoomId: this.virtualDataRoomId
      };

      console.log('Sending invitation data:', invitationData);

      this.invitationService.createInvitation(invitationData).subscribe(
        response => {
          console.log('Invitation created:', response);
          this.router.navigate(['/verify-email'], { queryParams: { id: this.virtualDataRoomId } });
        },
        error => {
          console.error('Error creating invitation:', error);
          this.toast.error(`Error: ${error.message}`);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }

  onCancel(): void {
    this.model = { email: '', firstName: '', lastName: '' };
  }
}
