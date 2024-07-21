import { RouterModule, Routes } from '@angular/router';
import {NzDemoUploadBasicComponent} from './nz-demo-upload-basic/nz-demo-upload-basic.component'
import { FormsDatetimeComponent } from './datetime/datetime.component';
import { FormsDynamicComponent } from './dynamic/dynamic.component';
import { FormsElementsComponent } from './elements/elements.component';
import { FormsSelectComponent } from './select/select.component';
import { VirtualDataRoomComponent } from './virtual-data-room/virtual-data-room.component';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NgModule } from '@angular/core';
export const routes: Routes = [
  { path: 'elements', component: FormsElementsComponent },
  { path: 'dynamic', component: FormsDynamicComponent },
  { path: 'select', component: FormsSelectComponent },
  { path: 'datetime', component: FormsDatetimeComponent },
  {path : 'virtual-data-room' , component : VirtualDataRoomComponent},
  { path: 'upload', component: NzDemoUploadBasicComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes), NzCollapseModule, NzIconModule],
  exports: [RouterModule]
})
export class FormsRoutingModule { }