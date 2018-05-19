import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from './services/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  messages:any[] = [];
  connection:Subscription;
  message:string = '';

  constructor(
    private socketService: SocketService
  ) {}

  sendMessage() {
    let enhancedMessage = {
      color: '#000000',
      content: this.message
    }
    this.socketService.sendMessage(enhancedMessage);
    this.message = '';
  }

  ngOnInit(): void {
    this.socketService.connect();

    this.connection = this.socketService.getMessages().subscribe(message => {
      this.messages.push(message['content']);
      console.log('Color: ' + message['color']);
    });
  }

  ngOnDestroy(): void {
    this.connection.unsubscribe();
  }

}
