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
  enabled = this.route.snapshot.queryParams['enabled'] ?? false;

  constructor(private route: ActivatedRoute) {}
}
