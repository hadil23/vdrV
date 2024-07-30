export interface Panel {
   id : string;
    title: string;
    files: File[]; 
    expanded: false;
  }
  
  export interface File {
    url: string; 
    name: string;
  }
  