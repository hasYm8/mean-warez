import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Role } from '../dtos/UserDto';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot
    ): Observable<boolean> {
        const requiredRoles = route.data['requiredRoles'] as Role[] || undefined;

        return this.authService.currentUser$.pipe(
            take(1),
            map(user => {
                // Guest mode
                if (!requiredRoles) {
                    if (!user) {
                        return true;
                    }
                    this.router.navigate(['/home']);
                    return false;
                }

                // Authenticated user required
                if (!user) {
                    this.router.navigate(['/login']);
                    return false;
                }

                // Bypass admin
                if (user.roles.includes(Role.ADMIN)) {
                    return true;
                }

                // Specific roles are required
                if (requiredRoles.length >= 1) {
                    const hasAllRoles = requiredRoles.every(role => user.roles.includes(role));
                    if (hasAllRoles) {
                        return true;
                    } else {
                        this.router.navigate(['/home']);
                        return false;
                    }
                }

                return true;
            })
        );
    }
}
