import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsISO8601,
  IsString,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class TournamentFilterDto {
  @ApiPropertyOptional({
    description: 'Дата начала',
  })
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'ID вида спорта',
  })
  @IsOptional()
  @IsUUID()
  sportId?: string;

  @ApiPropertyOptional({
    description: 'ID организатора',
  })
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @ApiPropertyOptional({
    description: 'Поиск',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
