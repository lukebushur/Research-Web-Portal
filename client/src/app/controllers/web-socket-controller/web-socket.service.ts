import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth-controller/auth.service';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private apiUrl = environment.apiUrl;
  private socket = io(this.apiUrl);

  constructor(private authService: AuthService) {}

  connect(): void {
  }
}
