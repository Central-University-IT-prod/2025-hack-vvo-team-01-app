import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class AddMemberDto {
  @ApiProperty()
  @IsNotEmpty()
  telegramName: string;
}
