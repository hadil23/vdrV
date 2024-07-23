import { Injectable } from '@angular/core';
import { Cloudinary } from 'cloudinary-core';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private cloudinary: any;

  constructor() {
    this.cloudinary = new Cloudinary({
      cloud_name: 'dxh0i7gwn',
      secure: true 
    });
  }

  uploadFile(file: File, preset: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/upload`;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', preset);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject(xhr.response);
        }
      };

      xhr.onerror = () => reject(xhr.response);
      xhr.send(formData);
    });
  }
}