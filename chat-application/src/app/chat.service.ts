import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Message } from './message';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import * as SignalR from '@aspnet/signalr';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection: SignalR.HubConnection;
  private chatUrl = 'https://localhost:5001';
  private listeners: CallableFunction[] = [];

  constructor(
    private http: HttpClient
  ) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  }

  startConnection(): void {
    this.hubConnection = new SignalR.HubConnectionBuilder()
      .withUrl(`${this.chatUrl}/messages`)
      .build();
    this.hubConnection
      .start()
      .then(() => { console.log("Connection started"); this.subscribeClients(); })
      .catch(err => console.log(`Error while starting connection: ${err}`))
  }

  onReceivedMessage(callable: CallableFunction): void {
    console.log("Registered new listener");
    this.listeners.push(callable)
  }

  subscribeClients(): void {
    this.hubConnection.on("message", (messages) => {
      console.log("Message received");
      this.listeners.forEach(listener => listener(messages));
    })
  }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.chatUrl}/chat/get-messages`)
    .pipe(
      catchError(this.handleError<Message[]>('getMessages', []))
    )
  }

  addMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(`${this.chatUrl}/chat/add-message`, message, this.httpOptions).pipe(
      catchError(this.handleError<Message>('addMessage'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed ${error.message}`);
      return of(result as T);
    }
  }
}
