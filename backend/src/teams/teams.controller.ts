import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TeamsService } from './teams.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Team } from './entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UuidDto } from 'src/common/dto/uuid.dto';

@ApiTags('Команды')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать команду' })
  @ApiResponse({ status: 201, type: Team })
  create(@Body() dto: CreateTeamDto, @CurrentUser() userId: string) {
    return this.teamsService.create(userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить информацию о команде' })
  @ApiResponse({ status: 200, type: Team })
  @ApiParam({ name: 'id', description: 'ID команды' })
  getById(@Param() params: UuidDto): Promise<Team> {
    return this.teamsService.getById(params.id);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Добавить участника в команду' })
  @ApiResponse({ status: 200, type: Team })
  @ApiParam({ name: 'id', description: 'ID команды' })
  addMember(
    @Param() params: UuidDto,
    @Body() dto: AddMemberDto,
    @CurrentUser() userId: string,
  ): Promise<Team> {
    return this.teamsService.addMember(userId, params.id, dto);
  }

  @Delete(':id/members/:memberId')
  @ApiOperation({ summary: 'Удалить участника из команды' })
  @ApiResponse({ status: 200, type: Team })
  @ApiParam({ name: 'id', description: 'ID команды' })
  @ApiParam({ name: 'memberId', description: 'ID участника' })
  removeMember(
    @Param() params: UuidDto & { memberId: string },
    @CurrentUser() userId: string,
  ): Promise<Team> {
    return this.teamsService.removeMember(userId, params.id, params.memberId);
  }
}
