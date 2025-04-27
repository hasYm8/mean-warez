import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TorrentDto } from '../../dtos/Torrent';
import { TorrentService } from '../../services/torrent.service';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { CommentDto } from '../../dtos/Comment';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserDto } from '../../dtos/User';
import { Rating } from 'primeng/rating';

@Component({
  selector: 'app-torrent',
  imports: [CommonModule, CardModule, ButtonModule, FormsModule, TextareaModule, Rating],
  templateUrl: './torrent.component.html',
  styleUrl: './torrent.component.scss'
})
export class TorrentComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  currentUser: UserDto | null = null;
  torrentId: string | null = null;
  torrent: TorrentDto | null = null;
  comments: CommentDto[] = [
    {
      user: { id: "6803b2f3fd185d2c5979eb2a", username: 'Alice' },
      torrentId: 'torrent-abc-123',
      text: 'Great upload, seeding now!',
      date: new Date('2025-04-10T10:30:00Z'), // Example past date
    },
    {
      user: { id: "6803b2f3fd185d2c5979eb2a", username: 'Bob' },
      torrentId: 'torrent-abc-123', // Same torrent as Alice's comment
      text: 'Thanks! Works perfectly on my system.',
      date: new Date('2020-04-26T14:15:00Z'),
    },
    {
      user: { id: "6803b2f3fd185d2c5979eb2a", username: 'Charlie' },
      torrentId: 'torrent-xyz-789', // A different torrent
      text: 'Anyone else having issues with chapter 3?',
      date: new Date('2025-04-27T08:00:00Z'),
    },
    {
      user: { id: "6803b2f3fd185d2c5979eb2a", username: 'David' },
      torrentId: 'torrent-xyz-789', // Same torrent as Charlie's comment
      text: 'No issues here, maybe try redownloading?',
      date: new Date('2025-02-27T09:45:10Z'),
    },
    {
      user: { id: '6803b2f3fd185d2c5979eb2a', username: 'Eve' }, // Example with a predefined ID
      torrentId: 'torrent-abc-123', // Back to the first torrent
      text: 'Appreciate the fast speeds.',
      date: new Date(), // Current date and time
    },
  ];
  commentText: string = '';

  rateScore: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private torrentService: TorrentService,
    private messageService: MessageService,
    private authService: AuthService
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

    this.currentUser = this.authService.currentUser;

    this.torrentService.getAllComments(this.torrentId!).subscribe({
      next: (data) => {
        this.comments = data;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load comments' });
      }
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
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

  onSubmit() {
    const comment = {
      user: {
        id: this.currentUser!.id,
        username: this.currentUser!.username
      },
      torrentId: this.torrentId!,
      text: this.commentText,
      date: new Date()
    };

    this.torrentService.saveComment(comment)
      .subscribe({
        next: (res) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Comment submitted successfully' });
          this.comments.push(comment);
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Comment submit failed' });
        }
      });

    this.commentText = '';
  }

  onRate() {
    if (this.rateScore) {
      this.torrentService.rate(this.torrentId!, this.rateScore)
        .subscribe({
          next: (res) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Rated successfully' });
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Rate failed' });
          }
        });
    }
  }

  onCancelRate() {
    if (!this.rateScore) {
      this.torrentService.deleteRate(this.torrentId!)
        .subscribe({
          next: (res) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Rate deleted successfully' });
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Rate deletion failed' });
          }
        });
    }
  }
}
