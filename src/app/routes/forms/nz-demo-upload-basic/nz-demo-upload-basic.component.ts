import { Component, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadXHRArgs, NzUploadModule } from 'ng-zorro-antd/upload';
import { CloudinaryService } from '../services/CloudinaryService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nz-demo-upload-basic',
  standalone: true,  // Indiquer que ce composant est autonome
  imports: [
    NzUploadModule  // Importer le module requis directement ici
  ],
  templateUrl: './nz-demo-upload-basic.component.html',
  styleUrls: ['./nz-demo-upload-basic.component.scss']
})
export class NzDemoUploadBasicComponent {
  @Output() nzChange = new EventEmitter<NzUploadChangeParam>();

  constructor(private msg: NzMessageService, private cloudinaryService: CloudinaryService) {}

  handleChange(event: NzUploadChangeParam): void {
    this.nzChange.emit(event);  // Émettre l'événement
    if (event.file.status === 'done') {
      this.msg.success(`${event.file.name} file uploaded successfully`);
      console.log(`${event.file.name} file uploaded successfully to Cloudinary`);
    } else if (event.file.status === 'error') {
      this.msg.error(`${event.file.name} file upload failed.`);
      console.error(`${event.file.name} file upload failed.`);
    }
  }

  customReq = (item: NzUploadXHRArgs): Subscription => {
    const { file, onSuccess, onError } = item;
    const preset = 'ml_default';

    this.cloudinaryService.uploadFile(file as unknown as File, preset).then(
      (result) => {
        console.log('File uploaded to Cloudinary:', result);
        onSuccess!(result, file, {} as any);
      },
      (error) => {
        console.error('Error uploading file to Cloudinary:', error);
        onError!(error, file);
      }
    );

    return new Subscription();
  };
}


