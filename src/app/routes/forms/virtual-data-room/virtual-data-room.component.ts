import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { NzDemoUploadBasicComponent } from '../nz-demo-upload-basic/nz-demo-upload-basic.component';

@Component({
  selector: 'app-virtual-data-room',
  standalone: true,
  imports: [MatExpansionModule, NzDemoUploadBasicComponent],
  templateUrl: './virtual-data-room.component.html',
  styleUrls: ['./virtual-data-room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualDataRoomComponent {
  panelOpenState = signal(false);
}
