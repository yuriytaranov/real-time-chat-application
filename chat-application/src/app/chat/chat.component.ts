import { Component, OnInit } from '@angular/core';
import { Message } from '../message';
import { ChatService } from '../chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: Message[];

  constructor(
    private chatService: ChatService
  ) { }

  ngOnInit(): void {
    this.getMessages();
    this.listenToMessages();
    this.chatService.startConnection();
  }

  getMessages(): void {
    this.chatService.getMessages()
      .subscribe(messages => { this.messages = messages; console.log(messages)} );
  }

  addMessage(content: string): void {
    content = content.trim();
    if(!content) { return; }
    this.chatService.addMessage({content: content} as Message)
      .subscribe(message => {this.messages.push(message); this.getMessages();});
    
  }

  listenToMessages(): void {
    this.chatService.onReceivedMessage((messages) => {
      this.messages = messages;
    })
  }
}
