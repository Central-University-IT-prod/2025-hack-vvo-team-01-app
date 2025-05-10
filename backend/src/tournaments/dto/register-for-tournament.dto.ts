import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, ValidateIf } from 'class-validator';

export class RegisterForTournamentDto {
  @ApiPropertyOptional({
    description: 'ID команды для регистрации (если турнир командный)',
  })
  @IsOptional()
  @IsUUID()
  teamId?: string;
}
