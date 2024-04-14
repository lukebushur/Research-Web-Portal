import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth-controller/auth.service';
import { io, Socket } from 'socket.io-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socketUrl = environment.socketURL;
  private socket: Socket;
  public applicationSubject: Subject<any> = new Subject<any>

  constructor() {
    this.socket = io(this.socketUrl);

    //used to listen for application updates
    this.socket.on('newApplication', (data: any) => {
      this.applicationSubject.next(data);
    });
  }
}
