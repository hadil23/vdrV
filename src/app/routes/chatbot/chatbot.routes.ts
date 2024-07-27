
import { RouterModule, Routes } from '@angular/router';
import { ChatbotComponent } from './chat-bot/chat-bot.component';
import { NgModule } from '@angular/core';



export const routes: Routes = [
  { path: 'chat', component:ChatbotComponent },

];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ChatbotRoutingModule { }