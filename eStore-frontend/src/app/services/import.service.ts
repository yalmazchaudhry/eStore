import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImportService {
  private importTrigger = new Subject<Event>();

  importRequested$ = this.importTrigger.asObservable();

  requestImport(event: Event) {
    this.importTrigger.next(event);
  }
}
