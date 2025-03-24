import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-large-application-status',
  imports: [],
  templateUrl: './large-application-status.component.html',
  styleUrl: './large-application-status.component.css'
})
export class LargeApplicationStatusComponent {
  readonly status = input.required<'Accept' | 'Reject' | 'Pending'>();
  readonly statusText = computed(() => {
    if (this.status() === 'Accept') {
      return 'Accepted!';
    } else if (this.status() === 'Reject') {
      return 'Rejected';
    } else {
      return 'Pending';
    }
  });
  readonly statusClass = computed(() => {
    if (this.status() === 'Accept') {
      return 'accept';
    } else if (this.status() === 'Reject') {
      return 'reject';
    } else {
      return 'pending';
    }
  });
}
