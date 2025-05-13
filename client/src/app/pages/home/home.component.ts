import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TorrentDto } from '../../dtos/Torrent';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Rating } from 'primeng/rating';
import { TorrentService } from '../../services/torrent.service';
import { Router, RouterModule } from '@angular/router';
import { Role, UserDto } from '../../dtos/User';
import { AuthService } from '../../services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CategoryDto } from '../../dtos/Category';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-home',
  imports: [CommonModule, TableModule, FormsModule, Rating, RouterModule, MultiSelectModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  Role = Role;

  currentUser: UserDto | null = null;
  torrents: TorrentDto[] = [];
  categories: CategoryDto[] = [];
  selectedCategories: CategoryDto[] = [];

  constructor(
    private torrentService: TorrentService,
    private router: Router,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;

    this.loadTorrents();
    this.loadCategories();
  }

  loadTorrents() {
    this.torrentService.getAll(this.selectedCategories).subscribe({
      next: (data) => {
        this.torrents = data;
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

  routeTorrent(id: string) {
    this.router.navigate(['/torrent', id]);
  }

  confirmDeleteTorrent(event: Event, torrentId: string) {
    event.stopPropagation();

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete the torrent?',
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
        this.deleteTorrent(torrentId);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      },
    });
  }

  private deleteTorrent(torrentId: string) {
    this.torrentService.delete(torrentId).subscribe({
      next: (data) => {
        this.torrents = this.torrents.filter(torrent => torrent.id !== torrentId);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Torrent deleted successfully' });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete torrent' });
      }
    });
  }
}
