import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TorrentDto } from '../../dtos/TorrentDto';
import { FormsModule } from '@angular/forms';
import { Rating } from 'primeng/rating';
import { TorrentService } from '../../services/torrent.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, TableModule, FormsModule, Rating, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  value: number = 3;

  torrents: TorrentDto[] = [];

  constructor(
    private torrentService: TorrentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadTorrents();
  }

  private loadTorrents() {
    this.torrentService.getAll().subscribe({
      next: (data) => {
        this.torrents = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  routeTorrent(id: string) {
    this.router.navigate(['/torrent', id]);
  }
}
