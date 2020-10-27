import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthServiceService} from '../../_services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  error = '';
  loading = false;
  submitted = false;
  constructor(private authService: AuthServiceService, private route: Router) {}


  ngOnInit() {
    this.registerForm = new FormGroup({
      name : new FormControl(null, [Validators.required, Validators.minLength(5)]),
      email : new FormControl(null, [Validators.required, Validators.email]),
      password : new FormControl(null, [Validators.required, Validators.minLength(5)]),
      password_confirmation : new FormControl(null, [Validators.required, Validators.minLength(5)])
    });
    this.authService.logout();
  }

  registerUser() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;
    if (this.registerForm.valid) {
      this.authService.registerUser(this.registerForm.value).subscribe(result => {
        if (result.success) {
          this.route.navigate(['login']);
        }
      },
        error => {
        this.error = error;
        this.loading = false;
        });
    }
  }
  get name() { return this.registerForm.get('name'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get password_confirmation() { return this.registerForm.get('password_confirmation'); }
}
