import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsOptional,
  IsUrl,
  MinLength,
  IsNumber,
  IsArray,
  IsNotEmpty,
  isHexColor,
  IsHexColor,
} from 'class-validator';

export class CreateTeamDto {
  @ApiProperty()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(10)
  description?: string;

  @ApiProperty()
  @IsHexColor()
  color: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiProperty()
  @IsUUID()
  sportId: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsNotEmpty({ each: true })
  members: string[];
}
