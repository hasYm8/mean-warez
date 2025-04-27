import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Response } from '../dtos/Response';
import { map, Observable } from 'rxjs';
import { TorrentDto } from '../dtos/TorrentDto';
import { CommentDto } from '../dtos/Comment';

@Injectable({
  providedIn: 'root'
})
export class TorrentService {
  private apiUrl = environment.apiUrl + '/torrent';

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<TorrentDto[]> {
    return this.http.get<Response<TorrentDto[]>>(`${this.apiUrl}`)
      .pipe(
        map(res => res.data)
      );
  }

  getById(torrentId: string): Observable<TorrentDto> {
    return this.http.get<Response<TorrentDto>>(`${this.apiUrl}/${torrentId}`)
      .pipe(
        map(res => res.data)
      );
  }

  upload(uploadForm: { title: string, description: string, selectedCategories: any[], file: File }): Observable<HttpEvent<any>> {
    const formData = new FormData();

    formData.append('title', uploadForm.title);
    formData.append('description', uploadForm.description);
    formData.append('categories', JSON.stringify(uploadForm.selectedCategories));
    formData.append('file', uploadForm.file, uploadForm.file.name);

    return this.http.post<Response<any>>(`${this.apiUrl}/upload`, formData).pipe(
      map(res => res.data)
    );
  }

  download(torrentId: string): Observable<Blob> {
    const downloadUrl = `${this.apiUrl}/download/${torrentId}`;

    return this.http.get(downloadUrl, {
      responseType: 'blob'
    });
  }

  saveComment(comment: CommentDto): Observable<CommentDto> {
    return this.http.post<Response<CommentDto>>(`${this.apiUrl}/comment`, comment)
      .pipe(
        map(res => res.data)
      );
  }

  getAllComments(torrentId: string): Observable<CommentDto[]> {
    return this.http.get<Response<CommentDto[]>>(`${this.apiUrl}/${torrentId}/comment`)
      .pipe(
        map(res => res.data)
      );
  }
}
