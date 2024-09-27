import { Book } from 'src/books/entities/book.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class BookSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const bookRepository = dataSource.getRepository(Book);

    const books = [
      {
        code: 'JK-45',
        title: 'Harry Potter',
        author: 'J.K Rowling',
        stock: 1,
      },
      {
        code: 'SHR-1',
        title: 'A Study in Scarlet',
        author: 'Arthur Conan Doyle',
        stock: 1,
      },
      {
        code: 'TW-11',
        title: 'Twilight',
        author: 'Stephenie Meyer',
        stock: 1,
      },
      {
        code: 'HOB-83',
        title: 'The Hobbit, or There and Back Again',
        author: 'J.R.R. Tolkien',
        stock: 1,
      },
      {
        code: 'NRN-7',
        title: 'The Lion, the Witch and the Wardrobe',
        author: 'C.S. Lewis',
        stock: 1,
      },
    ];

    for (const bookData of books) {
      const book = new Book();
      Object.assign(book, bookData);
      await bookRepository.save(book);
    }
  }
}
