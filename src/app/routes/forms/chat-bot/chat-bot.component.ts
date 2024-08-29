import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chatService';
import { NzDrawerComponent } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss'],
  imports: [FormsModule ,NzDrawerComponent]
})
export class ChatbotComponent {
  userMessage: string = '';
  botReply: string = '';
  onInviteClick: any;

  constructor(private chatService: ChatService) {}

  sendMessage(): void {
    if (this.userMessage.trim()) {
      this.chatService.sendMessage(this.userMessage).subscribe(
        response => {
          this.botReply = response.reply;
          this.userMessage = ''; // Clear input after sending
        },
        error => {
          console.error('Error:', error);
        }
      );
    }
  }
}