import { Controller, Get, Param } from '@nestjs/common';
import { SportsService } from './sports.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Sport } from './entities/sport.entity';
import { UuidDto } from 'src/common/dto/uuid.dto';

@ApiTags('Виды спорта')
@Controller('sports')
export class SportsController {
  constructor(private readonly sportsService: SportsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список всех видов спорта' })
  @ApiResponse({
    status: 200,
    type: [Sport],
  })
  getAll() {
    return this.sportsService.getAll();
  }
}
