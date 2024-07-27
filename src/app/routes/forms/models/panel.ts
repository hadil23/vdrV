export interface Panel {
  expanded: boolean;
   id : string;
    title: string;
    files: File[]; 
  }
  
  export interface File {
    url: string; 
    name: string;
  }
  