import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { UserDto, Role } from '../../dtos/UserDto';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  public Role = Role;
  isLoggedIn: boolean = false;
  currentUser: UserDto | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(res => {
      this.isLoggedIn = this.authService.isLoggedIn;
    });

    this.authService.currentUser$.subscribe(res => {
      this.currentUser = this.authService.currentUser;
    }
    )
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Logged out' });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed logout' });
      }
    });
  }

  hasRole(role: Role) {
    return this.currentUser?.roles.includes(role);
  }
}
