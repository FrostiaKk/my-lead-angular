import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthServiceService} from '../_services/auth-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loggedIn;
  constructor(private authService: AuthServiceService) { }

  ngOnInit() {
    // Check if logged in.
    this.loggedIn = this.authService.isLoggedIn();
  }

}
