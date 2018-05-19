import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket;

  constructor() { }

  connect(): void {
    this.socket = io(window.location.origin);
  }

  disconnect(): void {
    this.socket.emit('disconnect');
  }

  sendMessage(message): void {
    this.socket.emit('add-message', message);
  }

  getMessages(): Observable<{}> {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
}
