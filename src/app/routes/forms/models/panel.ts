export interface Panel {
   id : string;
    title: string;
    files: File[]; 
    expanded: false;
    hover: boolean;
  }
  
  export interface File {
    url: string; 
    name: string;
  }
  