import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth-controller/auth.service';
import { io, Socket } from 'socket.io-client';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { StudentDashboardService } from '../student-dashboard-controller/student-dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socketUrl = environment.socketURL;
  private socket: Socket;
  public applicationSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null)

  constructor(private studentService: StudentDashboardService,) {
    this.socket = io(this.socketUrl);
    this.socket.on('connect', () => {
      console.log('im connected!!!!')
    })

    //used to listen for application updates
    this.socket.on('newApplication', (data: any) => {
      console.log(data);
      this.studentService.getStudentApplications().subscribe({
        next: (data) => {
          this.applicationSubject.next(data.success.applications);
        },
        error: (error) => {
          console.error('Error fetching applications', error);
        },
      })
    });
  }
}
