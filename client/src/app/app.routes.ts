import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: 'login', loadComponent: () => import('./pages/login/login.component').then(a => a.LoginComponent)},
    {path: 'register', loadComponent: () => import('./pages/register/register.component').then(a => a.RegisterComponent)},
    {path: 'forget-password', loadComponent: () => import('./pages/forget-password/forget-password.component').then(a => a.ForgetPasswordComponent)},
    {path: 'home', loadComponent: () => import('./pages/home/home.component').then(a => a.HomeComponent)},
];
