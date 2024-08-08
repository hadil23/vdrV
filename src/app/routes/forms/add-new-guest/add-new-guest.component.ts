import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PageHeaderComponent } from '@shared';
import { InvitationService } from '../services/invitation.service';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

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
    MatDialogModule,
  ],
  templateUrl: './add-new-guest.component.html',
  styleUrls: ['./add-new-guest.component.scss']
})
export class AddNewGuestComponent implements OnInit {
  private readonly toast = inject(ToastrService);
  private readonly invitationService = inject(InvitationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);

  @Output() onInviteClick = new EventEmitter<void>();
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

  userId: number = 36;
  virtualDataRoomId: string = '';

  ngOnInit(): void {
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
          this.openDialog('Invitation created successfully! '); // Pass success message
        },
        error => {
          console.error('Error creating invitation:', error);
          this.openDialog('You can only send the request to authenticated people.'); // Pass error message
        }
      );
    } else {
      this.toast.error('Please fill out all required fields.');
    }
  }

  openDialog(message: string): void {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '250px',
      data: { message: message } // Pass the message to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onCancel(): void {
    this.form.reset(); // Reset the form fields
    this.router.navigate(['/forms/virtual-data-room'], { queryParams: { id: this.virtualDataRoomId } });
  }
}
