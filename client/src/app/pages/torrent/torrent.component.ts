import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-torrent',
  imports: [],
  templateUrl: './torrent.component.html',
  styleUrl: './torrent.component.scss'
})
export class TorrentComponent implements OnInit {
  torrentId: string | null = null;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.torrentId = this.route.snapshot.params['id'];
  }
}
