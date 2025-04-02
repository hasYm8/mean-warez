import BookJson from './BookStore.books.json' with { type: "json" };
import Book from './models/Book.js';

export const seedBooksData = async () => {
    try {
        await Book.deleteMany({});
        await Book.insertMany(BookJson);
        console.log("Data seeded successfully");
    } catch (error) {
        console.log("Error: ", error);
    }
}