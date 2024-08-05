import { Panel } from './panel'

export interface VirtualDataRoom {
  name: any;
  date: string | number | Date;
  owner: any;
  views: any;
  selected: boolean;
  
  title: string;
  panels: Panel[];
  }
 