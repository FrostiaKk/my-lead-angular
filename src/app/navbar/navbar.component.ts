import {Component, Input, OnInit} from '@angular/core';
import {AuthGuard} from '../_guards/auth.guard';
import {logo} from '../../environments/environment';
import {AuthServiceService} from '../_services/auth-service.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  loggedIn = false;
  logo = '';
  @Input() msgFromHome: any[];
  constructor(private authService: AuthServiceService) {

  }

  ngOnInit() {
    // Set Logo
    this.logo = `${logo}`;
    // Check if logged in.
    this.loggedIn = this.authService.isLoggedIn();
  }

}
