export interface Panel {
   id : string;
    title: string;
    files: File[]; 
  }
  
  export interface File {
    url: string; 
    name: string;
  }
  