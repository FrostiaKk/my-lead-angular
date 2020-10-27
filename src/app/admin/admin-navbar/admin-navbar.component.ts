import { Component, OnInit } from '@angular/core';
import {logo} from '../../../environments/environment';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent implements OnInit {

  logo = '';
  constructor() { }

  ngOnInit() {
    this.logo = `${logo}`;
  }

}
