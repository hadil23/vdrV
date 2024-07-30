import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { FormsDatetimeComponent } from '../datetime/datetime.component';
import { VirtualRoomService } from '../services/virtual-room.service';
import { Router } from '@angular/router';
import moment from 'moment';

@Component({
  selector: 'app-create-virtual-room',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    TranslateModule,
    FormsDatetimeComponent,
  ],
  providers: [VirtualRoomService, Router],
  templateUrl: './create-virtual-room.component.html',
  styleUrls: ['./create-virtual-room.component.scss'],
})
export class CreateVirtualRoomComponent {
  reactiveForm1: FormGroup;

  constructor(private fb: FormBuilder, private virtualRoomService: VirtualRoomService, private router: Router) {
    this.reactiveForm1 = this.fb.group({
      virtualDataRoomTitle: ['', Validators.required],
      access: ['', Validators.required],
      defaultGuestPermission: ['', Validators.required],
      chosenDateTime: [new Date(), Validators.required],
     
    });
  }

  onSubmit() {
    if (this.reactiveForm1.valid) {
      const { virtualDataRoomTitle, access, defaultGuestPermission, chosenDateTime } = this.reactiveForm1.value;
  
      // Check if chosenDateTime is provided
      if (!chosenDateTime) {
        console.error('Error: Expiry date and time are required');
        return;
      }
  
      // Ensure chosenDateTime is a valid Date object
      if (!(chosenDateTime instanceof Date) || isNaN(chosenDateTime.getTime())) {
        console.error('Error: Invalid chosen date');
        return;
      }
  
     
      const expiryDateTime = moment(chosenDateTime).format('YYYY-MM-DD HH:mm:ss');
      const virtualRoomData = {
        name: virtualDataRoomTitle,
        defaultGuestPermission,
        access,
        expiryDateTime
      };
  
      console.log('Form submitted with the following data:', virtualRoomData);
  
      this.virtualRoomService.createVirtualDataRoom(virtualRoomData).subscribe(
        response => {
          console.log('Virtual Data Room created:', response);
          const virtualRoomId = response.data?.id;
  
          if (virtualRoomId) {
            
            this.router.navigate(['/forms/virtual-data-room'], {
              queryParams: {
                id: virtualRoomId,
                title: virtualRoomData.name,
                defaultGuestPermission: virtualRoomData.defaultGuestPermission,
                access: virtualRoomData.access
              }
            });
          } else {
            console.error('Error: Could not retrieve virtual data room ID');
          }
        },
        error => {
          console.error('Error creating virtual data room:', error);
        }
      );
    } else {
      this.reactiveForm1.markAllAsTouched(); 

      console.error('Form is invalid');
    }
  }
  

  onCancel(): void {
    this.reactiveForm1.reset();
  }
}
