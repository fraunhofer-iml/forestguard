import { BehaviorSubject } from 'rxjs';

export class SharedReload {
  public static reload2$ = new BehaviorSubject(undefined);

  reload$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
  triggerReload() {
    this.reload$.next(undefined);
  }
}
