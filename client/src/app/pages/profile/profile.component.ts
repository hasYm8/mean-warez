import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { UserDto } from '../../dtos/UserDto';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, InputGroupModule, InputGroupAddonModule, InputTextModule, SelectModule, ButtonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  currentUser: UserDto | null = null;
  profileForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadUser();
    this.initForm();
  }

  private loadUser() {
    this.currentUser = this.authService.currentUser;
  }

  private initForm() {
    this.profileForm = this.fb.group({
      firstName: [this.currentUser?.firstName || '', Validators.required],
      lastName: [this.currentUser?.lastName || '', Validators.required],
      username: [this.currentUser?.username || '', Validators.required],
      email: [
        this.currentUser?.email || '',
        [Validators.compose([Validators.required, Validators.email])]
      ]
    });
  }

  onSave() {
    if (this.currentUser && !this.profileForm.invalid) {
      this.currentUser.firstName = this.profileForm.value.firstName;
      this.currentUser.lastName = this.profileForm.value.lastName;
      this.currentUser.username = this.profileForm.value.username;
      this.currentUser.email = this.profileForm.value.email;

      this.userService.update(this.currentUser).subscribe({
        next: (data) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User updated successfully' });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update user' });
        }
      });
    }
  }
}
