import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Min, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Иван', description: 'Имя', required: true })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Петров', description: 'Фамилия', required: true })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 25, description: 'Возраст', required: true })
  @Min(1)
  age: number;

  @ApiPropertyOptional({ example: 70, description: 'Вес в кг' })
  @IsOptional()
  @Min(1)
  weight?: number;
}
