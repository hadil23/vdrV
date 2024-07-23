import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadModule, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CloudinaryService } from '../services/CloudinaryService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nz-demo-upload-basic',
  standalone: true,
  imports: [CommonModule, NzUploadModule, NzButtonModule, NzIconModule],
  templateUrl: './nz-demo-upload-basic.component.html',
  styleUrls: ['./nz-demo-upload-basic.component.scss']
})
export class NzDemoUploadBasicComponent {
  constructor(private msg: NzMessageService, private cloudinaryService: CloudinaryService) {}

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status === 'done') {
      this.msg.success(`${info.file.name} file uploaded successfully`);
      console.log(`${info.file.name} file uploaded successfully to Cloudinary`);
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file upload failed.`);
      console.error(`${info.file.name} file upload failed.`);
    }
  }

  customReq = (item: NzUploadXHRArgs): Subscription => {
    const { file, onSuccess, onError } = item;
    const preset = 'ml_default';

    const uploadFile = file as unknown as File;

    this.cloudinaryService.uploadFile(uploadFile, preset).then(
      (result) => {
        console.log('File uploaded to Cloudinary:', result);
        onSuccess!(result, file, {} as any);
      },
      (error) => {
        console.error('Error uploading file to Cloudinary:', error);
        onError!(error, file);
      }
    );

    // Return a dummy subscription since Subscription is required
    return new Subscription();
  };
}
