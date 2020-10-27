import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {baseUrl} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {User} from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
  login(data): Observable<any> {
    return this.http.post(`${baseUrl}login`, data)
      .pipe(map(user => {

        localStorage.setItem('currentUser', JSON.stringify(user));
        if (user instanceof User) {
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }
  registerUser(data): Observable<any> {
    return this.http.post(`${baseUrl}register`, data);
  }
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }
  // Check if logged in
  isLoggedIn() {
    if (localStorage.getItem('currentUser')) {
      return true;
    } else {
      return false;
    }
  }

}
