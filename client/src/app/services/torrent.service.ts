import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Response } from '../dtos/Response';
import { map, Observable } from 'rxjs';
import { TorrentDto } from '../dtos/Torrent';
import { CommentDto } from '../dtos/Comment';
import { CategoryDto } from '../dtos/Category';

@Injectable({
  providedIn: 'root'
})
export class TorrentService {
  private apiUrl = environment.apiUrl + '/torrent';

  constructor(
    private http: HttpClient
  ) { }

  getAll(filteredCategories: CategoryDto[]): Observable<TorrentDto[]> {
    return this.http.post<Response<TorrentDto[]>>(`${this.apiUrl}`, filteredCategories)
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

  delete(torrentId: string): Observable<any> {
    return this.http.delete<Response<any>>(`${this.apiUrl}/${torrentId}`)
      .pipe(
        map(res => res.data)
      );
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

  deleteComment(commentId: string): Observable<any> {
    return this.http.delete<Response<any>>(`${this.apiUrl}/${commentId}/comment`)
      .pipe(
        map(res => res.data)
      );
  }

  rate(torrentId: string, score: number): Observable<any> {
    return this.http.post<Response<any>>(`${this.apiUrl}/${torrentId}/rate`, { score: score })
      .pipe(
        map(res => res.data)
      );
  }

  deleteRate(torrentId: string): Observable<any> {
    return this.http.delete<Response<any>>(`${this.apiUrl}/${torrentId}/rate`)
      .pipe(
        map(res => res.data)
      );
  }

  createCategory(name: string): Observable<CategoryDto> {
    return this.http.post<Response<CategoryDto>>(`${this.apiUrl}/category`, { name: name })
      .pipe(
        map(res => res.data)
      );
  }

  getAllCategories(): Observable<CategoryDto[]> {
    return this.http.get<Response<CategoryDto[]>>(`${this.apiUrl}/category`)
      .pipe(
        map(res => res.data)
      );
  }

  deleteCategory(categoryId: string): Observable<any> {
    return this.http.delete<Response<any>>(`${this.apiUrl}/category/${categoryId}`)
      .pipe(
        map(res => res.data)
      );
  }

  updateCategory(category: CategoryDto): Observable<CategoryDto> {
    return this.http.patch<Response<CategoryDto>>(`${this.apiUrl}/category/${category.id}`, category)
      .pipe(
        map(res => res.data)
      );
  }
}
