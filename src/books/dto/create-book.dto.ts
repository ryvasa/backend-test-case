import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: 'JK-45' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ example: 'The Hobbit' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'JRR Tolkien' })
  @IsNotEmpty()
  @IsString()
  author: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  stock: number;
}
