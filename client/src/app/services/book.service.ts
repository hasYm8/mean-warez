import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private http = inject(HttpClient);
  private serviceApiUrl = environment.apiUrl + '/book';

  getBooks() {
    return this.http.get<Response<Book[]>>(this.serviceApiUrl)
  }
}

export type Book = {
  _id: string;
  title: string;
  isbn13: string;
  price: string;
  image: string;
  url: string;
}

export type Response<T> = {
  success: boolean;
  status: number;
  message: string;
  data: T;
}