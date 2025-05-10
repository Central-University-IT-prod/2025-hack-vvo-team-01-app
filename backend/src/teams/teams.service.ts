import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { UserService } from 'src/user/user.service';
import { SportsService } from 'src/tournaments/sports.service';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    private userService: UserService,
    private sportsService: SportsService,
  ) {}

  async getById(id: string): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: ['members'],
    });

    if (!team) {
      throw new NotFoundException('Команда не найдена');
    }

    return team;
  }

  async isUserMember(teamId: string, userId: string): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: {
        id: teamId,
        members: { id: userId },
      },
      relations: ['members'],
    });

    if (!team) {
      throw new NotFoundException('Команда не найдена');
    }

    return team;
  }

  async create(userId: string, data: CreateTeamDto): Promise<Team> {
    const sport = await this.sportsService.getById(data.sportId);

    const creator = await this.userService.getById(userId);
    const members = [creator];

    for (const telegramName of data.members) {
      try {
        const user = await this.userService.getByTelegram(telegramName);
        if (!members.some((member) => member.id === user.id)) {
          members.push(user);
        }
      } catch {}
    }

    const team = this.teamRepository.create({
      ...data,
      members,
    });

    return this.teamRepository.save(team);
  }

  async addMember(
    userId: string,
    teamId: string,
    data: AddMemberDto,
  ): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id: teamId, members: { id: userId } },
      relations: ['members'],
    });

    if (!team) {
      throw new NotFoundException('Команда не найдена');
    }

    const user = await this.userService.getByTelegram(data.telegramName);

    if (team.members.some((member) => member.id === user.id)) {
      throw new BadRequestException('Пользователь уже является членом команды');
    }

    team.members.push(user);
    return this.teamRepository.save(team);
  }

  async removeMember(
    userId: string,
    teamId: string,
    memberId: string,
  ): Promise<Team> {
    if (memberId === userId) {
      throw new BadRequestException('Вы не можете удалить себя из команды');
    }

    const team = await this.teamRepository.findOne({
      where: { id: teamId, members: { id: userId } },
      relations: ['members'],
    });

    if (!team) {
      throw new NotFoundException('Команда не найдена');
    }

    team.members = team.members.filter((member) => member.id !== memberId);
    return this.teamRepository.save(team);
  }
}
