import { RouterModule, Routes } from '@angular/router';

import { FormsDatetimeComponent } from './datetime/datetime.component';
import { FormsDynamicComponent } from './dynamic/dynamic.component';
import { FormsElementsComponent } from './create-virtual-room/elements.component';
import { FormsSelectComponent } from './select/select.component';
import { VirtualDataRoomComponent } from './virtual-data-room/virtual-data-room.component';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NgModule } from '@angular/core';
import {CreateVirtualRoomComponent} from './create-virtual-room/create-virtual-room.component';
import { AddNewGuestComponent } from './add-new-guest/add-new-guest.component';
import { ManageDataRoomsComponent } from './manage-data-rooms/manage-data-rooms.component';
import { DraftComponent } from './draft/draft.component';
import { CardComponent } from '../material/card/card.component';
import { HomeComponent } from './home/home.component';
export const routes: Routes = [
  { path: 'elements', component: FormsElementsComponent },
  { path: 'dynamic', component: FormsDynamicComponent },
  { path: 'select', component: FormsSelectComponent },
  { path: 'datetime', component: FormsDatetimeComponent },
  {path : 'virtual-data-room' , component : VirtualDataRoomComponent},
  {path : 'virtual-data-room/:id' , component : VirtualDataRoomComponent},
{path:'manage-data-room', component : ManageDataRoomsComponent},
  { path: 'create-virtual-room', component: CreateVirtualRoomComponent },
  { path: 'add-new-guest', component: AddNewGuestComponent },
  { path: 'draft', component: DraftComponent },
  {path :'home' ,component:HomeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes), NzCollapseModule, NzIconModule],
  exports: [RouterModule]
})
export class FormsRoutingModule { }