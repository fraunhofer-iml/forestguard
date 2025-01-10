import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './unauthorized.component.html',
})
export class UnauthorizedComponent {
  accountDisabled = this.route.snapshot.queryParams['account-disabled'] ?? false;

  constructor(private route: ActivatedRoute) {}
}
