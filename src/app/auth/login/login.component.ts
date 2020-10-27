import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthServiceService} from '../../_services/auth-service.service';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  constructor(
    private router: Router,
    private authenticationService: AuthServiceService
  ) {}


  ngOnInit() {
    this.loginForm = new FormGroup({
      email : new FormControl(null, [Validators.required, Validators.email]),
      password : new FormControl(null, [Validators.required, Validators.minLength(5)])
    });
    this.authenticationService.logout();
    this.returnUrl = '/admin/items';
  }

  loginProcess() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    if (this.loginForm.valid) {
      this.authenticationService.login(this.loginForm.value).pipe(first())
        .subscribe(result => {
          if (result.success) {
            this.router.navigate([this.returnUrl]);
          } else {
            this.error = result.message;
            this.loading = false;
          }
        });
    }
  }
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
