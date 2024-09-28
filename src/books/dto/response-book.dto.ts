import { ApiProperty } from '@nestjs/swagger';

export class BookDto {
  @ApiProperty({ example: 'TW-11' })
  code: string;

  @ApiProperty({ example: 'Twilight' })
  title: string;

  @ApiProperty({ example: 'Stephenie Meyer' })
  author: string;
}

export class BookWithDateDto {
  @ApiProperty({ example: 'TW-11' })
  code: string;

  @ApiProperty({ example: 'Twilight' })
  title: string;

  @ApiProperty({ example: 'Stephenie Meyer' })
  author: string;

  @ApiProperty({ example: 1 })
  stock: number;

  @ApiProperty({ example: '2024-09-27T19:02:09.603Z' })
  creatd_at: Date;

  @ApiProperty({ example: '2024-09-27T19:02:09.603Z' })
  updated_at: Date;
}

// ONE BOOK
export class BookResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'OK' })
  message: string;

  @ApiProperty({ type: BookWithDateDto })
  data: BookWithDateDto;
}

// MANY BOOKS
export class BooksResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'OK' })
  message: string;

  @ApiProperty({ type: [BookWithDateDto] })
  data: [BookWithDateDto];
}

// BOOK MESSAGE
export class BookMessageDto {
  @ApiProperty({ example: 'Book is deleted successfully.' })
  message: string;
}

export class BookMessageResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'OK' })
  message: string;

  @ApiProperty({ type: BookMessageDto })
  data: BookMessageDto;
}
