import { Routes } from '@angular/router';
import { AuthGuardService } from './auth/auth-guard.service';
import { Role } from './dtos/UserDto';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(a => a.LoginComponent),
        canActivate: [AuthGuardService]
    },
    {
        path: 'register',
        loadComponent: () => import('./pages/register/register.component').then(a => a.RegisterComponent),
        canActivate: [AuthGuardService]
    },
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(a => a.HomeComponent),
        canActivate: [AuthGuardService],
        data: { requiredRoles: [Role.USER] }
    },
    {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(a => a.ProfileComponent),
        canActivate: [AuthGuardService],
        data: { requiredRoles: [Role.USER] }
    },
    {
        path: 'admin',
        loadComponent: () => import('./pages/admin/admin.component').then(a => a.AdminComponent),
        canActivate: [AuthGuardService],
        data: { requiredRoles: [Role.USER] }
    },
    {
        path: 'upload',
        loadComponent: () => import('./pages/upload/upload.component').then(a => a.UploadComponent),
        canActivate: [AuthGuardService],
        data: { requiredRoles: [Role.USER] }
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
