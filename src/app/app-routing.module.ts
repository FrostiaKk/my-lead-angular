import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {HomeComponent} from './home/home.component';
import {AuthGuard} from './_guards/auth.guard';
import {WelcomeComponent} from './admin/welcome/welcome.component';
import {ItemComponent} from './admin/item/item.component';
import {ItemsComponent} from './admin/items/items.component';
import {DisplayComponent} from './display/display.component';
import {ElementComponent} from './element/element.component';


const routes: Routes = [
  {path: '', component: HomeComponent, children: [
      {path: 'login', component: LoginComponent},
      {path: 'register', component: RegisterComponent},
      {path: 'home', component: DisplayComponent},
      {path: 'home/:id', component: ElementComponent}
    ]},
  {path: 'admin', component: WelcomeComponent, canActivate: [AuthGuard], children: [
      {path: 'items', component: ItemsComponent, canActivate: [AuthGuard]},
      {path: 'items/:id', component: ItemComponent, canActivate: [AuthGuard]},
      {path: 'item', component: ItemComponent, canActivate: [AuthGuard]}
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
