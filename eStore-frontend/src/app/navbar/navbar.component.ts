import { Component } from '@angular/core';
// import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ImportService } from '../services/import.service';
import { NavbarService } from '../services/navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  currentRoute: string = '';

  constructor(
    private authService: AuthService,
    private importService: ImportService,
    private navbarService: NavbarService
  ) // private router: Router
  {
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     this.currentRoute = event.urlAfterRedirects;
    //   }
    // });
  }
  isLoggedIn: boolean = !!localStorage.getItem('isLoggedIn');
  importData(event: Event) {
    this.importService.requestImport(event);
  }
  addProduct(): void {
    this.navbarService.setIsAdding(true);
  }
  logOut() {
    this.authService.logOut();
  }
  // showProductsList() {
  //   if (this.currentRoute === '/products-list') {
  //     this.router.navigate(['']);
  //   } else {
  //     this.router.navigate(['products-list']);
  //   }
  // }
}
