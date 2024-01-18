import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-faculty-toolbar',
  templateUrl: './faculty-toolbar.component.html',
  styleUrls: ['./faculty-toolbar.component.css']
})
export class FacultyToolbarComponent {

  constructor(private router: Router) { }
}
