import { Component } from '@angular/core';
import { NavbarService } from './services/navbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'eStore-frontend';
  constructor(private navbarService: NavbarService) {}

  shouldShowNavbar(): boolean {
    const currentRoute = this.navbarService.currentRoute;
    return (
      !currentRoute.includes('/login') && !currentRoute.includes('/signUp')
    );
  }
}
