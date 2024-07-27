import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChatService } from '../chat-bot.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss'],
  imports: [FormsModule, HttpClientModule]
})
export class ChatbotComponent {
  userMessage: string = '';
  botReply: string = '';

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
