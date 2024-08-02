import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'formatFileName',
    standalone: true 
  })
  export class FormatFileNamePipe implements PipeTransform {
    transform(cloudinaryUrl: string): string {
      const regex = /\/([^\/]+)\.([^.]+)$/;
      const match = regex.exec(cloudinaryUrl);
  
      if (match) {
        const fileName = match[1];
        const fileExtension = match[2];
        return `${fileName}.${fileExtension}`;
      } else {
        return '';
      }
    }
  }