import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth-controller/auth.service';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private apiUrl = environment.apiUrl;
  private socket = io(this.apiUrl);

  connect() {
    this.socket.emit('connection');
  }
}
