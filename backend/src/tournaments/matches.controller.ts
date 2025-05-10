import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RecordMatchResultDto } from './dto/record-match-result.dto';
import { UuidDto } from 'src/common/dto/uuid.dto';

@ApiTags('Игры')
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post(':id/result')
  @ApiOperation({ summary: 'Зафиксировать результаты игры' })
  async updateMatchResult(
    @Param() { id }: UuidDto,
    @Body() data: RecordMatchResultDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.matchesService.recordMatchResult(userId, id, data);
  }
}
