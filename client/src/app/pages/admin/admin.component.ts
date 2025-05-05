import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { UserService } from '../../services/user.service';
import { UserDto } from '../../dtos/User';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TabsModule } from 'primeng/tabs';
import { ListboxModule } from 'primeng/listbox';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CategoryDto } from '../../dtos/Category';
import { TorrentService } from '../../services/torrent.service';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-admin',
  imports: [FormsModule, CommonModule, TableModule, TabsModule, ListboxModule, ButtonModule, DialogModule, InputGroupModule, InputGroupAddonModule, InputTextModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  users: UserDto[] = [];
  categories: CategoryDto[] = [];

  categoryName: string = '';
  updatedCategoryId: string = '';
  isCreateDialogVisible: boolean = false;
  isUpdateDialogVisible: boolean = false;

  constructor(
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private torrentService: TorrentService
  ) { }

  ngOnInit() {
    this.loadUsers();
    this.loadCategories();
  }

  private loadUsers() {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  private loadCategories() {
    this.torrentService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  confirmDeleteUser(event: Event, userId: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete the user?',
      header: 'Danger Zone',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },

      accept: () => {
        this.deleteUser(userId);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      },
    });
  }

  private deleteUser(userId: string) {
    this.userService.delete(userId).subscribe({
      next: (data) => {
        this.users = this.users.filter(user => user.id !== userId);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User deleted successfully' });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete user' });
      }
    });
  }

  showCreateDialog() {
    this.isCreateDialogVisible = true;
  }

  showUpdateDialog(category: CategoryDto) {
    this.updatedCategoryId = category.id;
    this.categoryName = category.name;
    this.isUpdateDialogVisible = true;
  }

  closeDialog() {
    this.isCreateDialogVisible = false;
    this.categoryName = '';

    this.isUpdateDialogVisible = false;
  }

  onCreateCategory() {
    if (this.categoryName) {
      this.torrentService.createCategory(this.categoryName)
        .subscribe({
          next: (res) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category successfully created' });
            this.categories = [...this.categories, res];

            this.closeDialog();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Category creation failed' });
          }
        });
    }
  }

  onUpdateCategory() {
    const category: CategoryDto | undefined = this.categories.find(category => category.id === this.updatedCategoryId);

    if (category) {
      category.name = this.categoryName;
      this.torrentService.updateCategory(category)
        .subscribe({
          next: (res) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category successfully updated' });

            this.closeDialog();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Category update failed' });
          }
        });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Category update failed' });
      this.closeDialog();
    }
  }

  onDeleteCategory(id: string) {
    this.torrentService.deleteCategory(id)
      .subscribe({
        next: (res) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category successfully deleted' });
          this.categories = this.categories.filter(category => category.id !== id);
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Category deletion failed' });
        }
      });
  }
}
