import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TorrentDto } from '../../dtos/TorrentDto';
import { TorrentService } from '../../services/torrent.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-torrent',
  imports: [CardModule, ButtonModule],
  templateUrl: './torrent.component.html',
  styleUrl: './torrent.component.scss'
})
export class TorrentComponent implements OnInit {
  torrentId: string | null = null;
  torrent: TorrentDto | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private torrentService: TorrentService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.torrentId = this.route.snapshot.params['id'];

    this.torrentService.getById(this.torrentId!).subscribe({
      next: (data) => {
        this.torrent = data;
      },
      error: (err) => {
        this.router.navigate(['/home']);
      }
    });
  }

  onDownload(): void {
    if (this.torrentId) {
      const desiredFilename = this.torrent?.fileName ? this.torrent?.fileName : 'download';

      this.torrentService.download(this.torrentId).subscribe({
        next: (blob) => {
          if (blob.size === 0) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed download' });
            return;
          }

          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = desiredFilename;

          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed download' });
        }
      });
    }
  }
}
