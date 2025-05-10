import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, ValidateIf } from 'class-validator';
import { MatchResult } from '../entities/match.entity';
import { ScoringType } from '../entities/sport.entity';

export class RecordMatchResultDto {
  @ApiProperty({
    enum: MatchResult,
    description: 'Результат матча',
    example: MatchResult.WIN_1,
  })
  @IsEnum(MatchResult)
  result: MatchResult;

  @ApiProperty({
    description: 'Счет первого участника',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  score1?: number;

  @ApiProperty({
    description: 'Счет второго участника',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  score2?: number;
}
