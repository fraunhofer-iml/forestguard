import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sheet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sheet.component.html',
})
export class SheetComponent {
  visible = false;

  private previousTimeout: ReturnType<typeof setTimeout> | undefined;
  readonly closing$ = new Subject<boolean>();

  open() {
    this.visible = true;
  }

  close() {
    this.closing$.next(true);

    if (this.previousTimeout) {
      clearTimeout(this.previousTimeout);
    }

    this.previousTimeout = setTimeout(() => {
      this.visible = false;
    }, 300);
  }
}
