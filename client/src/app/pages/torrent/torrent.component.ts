import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TorrentDto } from '../../dtos/Torrent';
import { TorrentService } from '../../services/torrent.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { CommentDto } from '../../dtos/Comment';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserDto } from '../../dtos/User';
import { Rating } from 'primeng/rating';
import { Role } from '../../dtos/User';

@Component({
  selector: 'app-torrent',
  imports: [CommonModule, CardModule, ButtonModule, FormsModule, TextareaModule, Rating],
  templateUrl: './torrent.component.html',
  styleUrl: './torrent.component.scss'
})
export class TorrentComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  Role = Role;

  currentUser: UserDto | null = null;
  torrentId: string | null = null;
  torrent: TorrentDto | null = null;
  comments: CommentDto[] = [];
  commentText: string = '';
  rateScore: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private torrentService: TorrentService,
    private messageService: MessageService,
    private authService: AuthService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.torrentId = this.route.snapshot.params['id'];
    this.currentUser = this.authService.currentUser;

    this.loadTorrent();
    this.loadComments();
  }

  private loadTorrent() {
    this.torrentService.getById(this.torrentId!).subscribe({
      next: (data) => {
        this.torrent = data;
        if (this.torrent.userRateScore) {
          this.rateScore = this.torrent.userRateScore;
        }
      },
      error: (err) => {
        this.router.navigate(['/home']);
      }
    });
  }

  private loadComments() {
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
      id: '',
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
          this.comments.push(res);
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

  onDeleteComment(commentId: string) {
    this.torrentService.deleteComment(commentId)
      .subscribe({
        next: (res) => {
          this.comments = this.comments.filter(comment => comment.id !== commentId);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Comment deleted successfully' });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Comment deletion failed' });
        }
      });
  }

  confirmDeleteTorrent(event: Event, torrentId: string) {
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
        this.router.navigate(['/home']);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Torrent deleted successfully' });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete torrent' });
      }
    });
  }
}
