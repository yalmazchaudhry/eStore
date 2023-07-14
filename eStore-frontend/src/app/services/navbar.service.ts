import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  public currentRoute: string = '';
  private isAddingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public isAdding$ = this.isAddingSubject.asObservable();

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.currentRoute = event.url;
      }
    });
  }
  setIsAdding(value: boolean): void {
    this.isAddingSubject.next(value);
  }
}
