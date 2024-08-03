import { Component, OnInit } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { ChatbotComponent } from '../chat-bot/chat-bot.component';
import { DrawerService } from '../services/drawerService';

@Component({
  selector: 'app-chatbot-drawer',
  templateUrl: './chatbot-drawer.component.html',
  styleUrls: ['./chatbot-drawer.component.scss']
})
export class ChatbotDrawerComponent implements OnInit {
  constructor(private drawerService: DrawerService, private nzDrawerService: NzDrawerService) {}

  ngOnInit(): void {
    this.drawerService.openDrawer$.subscribe(() => {
      this.openDrawer();
    });
  }

  openDrawer(): void {
    this.nzDrawerService.create({
      nzTitle: '',
      nzContent: ChatbotComponent,
      nzPlacement: 'left',
      nzWidth: 400,
      nzClosable: true
    });
  }
}