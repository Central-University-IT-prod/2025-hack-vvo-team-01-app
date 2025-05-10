import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  SerializeOptions,
} from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Tournament } from './entities/tournament.entity';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { TelegramAuthGuard } from 'src/auth/guards/telegram.guard';
import { UuidDto } from 'src/common/dto/uuid.dto';
import { RegisterForTournamentDto } from './dto/register-for-tournament.dto';
import { Participant } from './entities/participant.entity';
import { TournamentFilterDto } from './dto/tournament-filter.dto';

@ApiTags('Соревнования')
@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать соревнование' })
  @ApiResponse({
    status: 201,
    description: 'Соревнование успешно создано',
    type: Tournament,
  })
  create(@Body() dto: CreateTournamentDto, @CurrentUser() userId: string) {
    return this.tournamentsService.create(userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить соревнование' })
  @ApiResponse({ status: 200, type: Tournament })
  getById(@Param() params: UuidDto) {
    return this.tournamentsService.getById(params.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить соревнование' })
  @ApiResponse({
    status: 200,
    description: 'Соревнование успешно обновлено',
    type: Tournament,
  })
  update(
    @Param() params: UuidDto,
    @Body() dto: UpdateTournamentDto,
    @CurrentUser() userId: string,
  ) {
    return this.tournamentsService.update(userId, params.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить соревнование' })
  @ApiResponse({ status: 200, description: 'Соревнование успешно удалено' })
  remove(@Param() params: UuidDto, @CurrentUser() userId: string) {
    return this.tournamentsService.remove(userId, params.id);
  }

  @Post(':id/moderation/approve')
  @ApiOperation({ summary: 'Модерация: одобрить' })
  @ApiResponse({ status: 201, type: Tournament })
  approve(@Param() params: UuidDto) {
    return this.tournamentsService.moderate(params.id, true);
  }

  @Post(':id/moderation/reject')
  @ApiOperation({ summary: 'Модерация: отклонить' })
  @ApiResponse({ status: 201, type: Tournament })
  reject(@Param() params: UuidDto) {
    return this.tournamentsService.moderate(params.id, false);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Добавить комментарий к турниру' })
  @ApiResponse({
    status: 201,
    description: 'Комментарий успешно добавлен',
    type: Comment,
  })
  createComment(
    @Param() params: UuidDto,
    @Body() dto: CreateCommentDto,
    @CurrentUser() userId: string,
  ) {
    return this.tournamentsService.createComment(userId, params.id, dto);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Получить комментарии турнира' })
  @ApiResponse({
    status: 200,
    type: [Comment],
  })
  getComments(@Param() params: UuidDto) {
    return this.tournamentsService.getComments(params.id);
  }

  @Delete('comments/:id')
  @ApiOperation({ summary: 'Удалить комментарий' })
  @ApiResponse({
    status: 200,
    description: 'Комментарий успешно удален',
  })
  deleteComment(@Param() params: UuidDto, @CurrentUser() userId: string) {
    return this.tournamentsService.deleteComment(userId, params.id);
  }

  @Post(':id/register')
  @ApiOperation({ summary: 'Регистрация на соревнование' })
  @ApiResponse({ status: 201, type: Participant })
  async registerForTournament(
    @Param() { id }: UuidDto,
    @Body() data: RegisterForTournamentDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.tournamentsService.registerForTournament(userId, id, data);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список соревнований' })
  @ApiResponse({
    status: 200,
    type: [Tournament],
  })
  @ApiQuery({ type: TournamentFilterDto })
  getTournaments(@Query() filters: TournamentFilterDto) {
    return this.tournamentsService.getWithFilters(filters);
  }
}
