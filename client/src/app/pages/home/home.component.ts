import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TorrentDto } from '../../dtos/TorrentDto';
import { FormsModule } from '@angular/forms';
import { Rating } from 'primeng/rating';
import { TorrentService } from '../../services/torrent.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, TableModule, FormsModule, Rating],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  value: number = 3;

  torrents: TorrentDto[] = [];

  constructor(
    private torrentService: TorrentService
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
}
