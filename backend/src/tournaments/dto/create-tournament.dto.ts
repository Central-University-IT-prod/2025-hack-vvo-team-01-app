import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsUUID,
} from 'class-validator';
import { TournamentType } from '../entities/tournament.entity';

export class CreateTournamentDto {
  @ApiProperty({
    example: 'Дворовой чемпионат по футболу',
    description: 'Название',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '110e8400-e29b-41d4-a716-446655440000',
    description: 'Вид спорта',
  })
  @IsUUID()
  sportId: string;

  @ApiProperty({
    example: '2025-05-03T00:00:00Z',
    description: 'Дата начала',
  })
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    example: '2025-05-05T00:00:00Z',
    description: 'Дата окончания',
  })
  @IsDateString()
  endDate: Date;

  @ApiProperty({
    enum: TournamentType,
    example: TournamentType.LEAGUE,
    description: 'Тип',
  })
  @IsEnum(TournamentType)
  type: TournamentType;

  @ApiPropertyOptional({
    example: 'Стадион "Динамо"',
    description: 'Место проведения',
  })
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ example: 3, description: 'Очки за победу (оверрайд)' })
  @IsOptional()
  @Min(0)
  pointsForWin?: number;

  @ApiPropertyOptional({ example: 1, description: 'Очки за ничью (оверрайд)' })
  @IsOptional()
  @Min(0)
  pointsForDraw?: number;

  @ApiPropertyOptional({
    example: 0,
    description: 'Очки за поражение (оверрайд)',
  })
  @IsOptional()
  @Min(0)
  pointsForLoss?: number;

  @ApiPropertyOptional({
    example: 'https://example.com/tournament-image.jpg',
    description: 'URL изображения',
  })
  @IsOptional()
  @IsString()
  image?: string;
}
