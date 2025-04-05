import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Book, BookService } from '../../services/book.service';
import { BookCardComponent } from '../../components/book-card/book-card.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, BookCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  private bookService = inject(BookService);
  books: Book[] = [];

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks() {
    this.bookService.getBooks()
      .subscribe({
        next: (res) => {
          this.books = res.data;
        },
      })
  }
}
