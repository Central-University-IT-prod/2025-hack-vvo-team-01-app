import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tournament, TournamentStatus } from './entities/tournament.entity';
import { Sport } from './entities/sport.entity';
import { Repository, Between, Like } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Participant } from './entities/participant.entity';
import { Team } from 'src/teams/entities/team.entity';
import { RegisterForTournamentDto } from './dto/register-for-tournament.dto';
import { TeamsService } from 'src/teams/teams.service';
import { TournamentFilterDto } from './dto/tournament-filter.dto';
import { Match } from './entities/match.entity';
import { MatchStatus } from './entities/match.entity';
import { SportsService } from './sports.service';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentRepository: Repository<Tournament>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,

    private sportsService: SportsService,
    private teamsService: TeamsService,
  ) {}

  async getById(id: string): Promise<Tournament> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id },
    });

    if (!tournament) {
      throw new NotFoundException('Турнир не найден');
    }

    return tournament;
  }

  async create(userId: string, data: CreateTournamentDto): Promise<Tournament> {
    const sport = await this.sportsService.getById(data.sportId);

    const tournament = this.tournamentRepository.create({
      ...data,
      author: { id: userId },
      status: TournamentStatus.UPCOMING,
    });

    return this.tournamentRepository.save(tournament);
  }

  async update(
    userId: string,
    id: string,
    data: UpdateTournamentDto,
  ): Promise<Tournament> {
    const tournament = await this.getById(id);

    if (tournament.author.id !== userId) {
      throw new ForbiddenException();
    }

    return this.tournamentRepository.save({ ...tournament, ...data });
  }

  async moderate(id: string, approved: boolean): Promise<Tournament> {
    const tournament = await this.getById(id);

    if (approved) {
      tournament.status = TournamentStatus.UPCOMING;
    } else {
      tournament.status = TournamentStatus.REJECTED;
    }

    return this.tournamentRepository.save(tournament);
  }

  async remove(userId: string, id: string) {
    const tournament = await this.getById(id);

    if (tournament.author.id !== userId) {
      throw new ForbiddenException();
    }

    return this.tournamentRepository.delete(id);
  }

  async createComment(
    userId: string,
    id: string,
    data: CreateCommentDto,
  ): Promise<Comment> {
    const tournament = await this.getById(id);

    const comment = this.commentRepository.create({
      text: data.text,
      tournament,
      author: { id: userId },
    });

    return this.commentRepository.save(comment);
  }

  async getComments(tournamentId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { tournament: { id: tournamentId } },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async deleteComment(userId: string, commentId: string): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId, author: { id: userId } },
    });

    if (!comment) {
      throw new NotFoundException('Комментарий не найден');
    }

    await this.commentRepository.delete(commentId);
  }

  async registerForTournament(
    userId: string,
    tournamentId: string,
    data: RegisterForTournamentDto,
  ): Promise<Participant> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id: tournamentId },
      relations: ['sport'],
    });

    if (!tournament) {
      throw new NotFoundException('Турнир не найден');
    }

    if (!tournament.isRegistrationOpen) {
      throw new BadRequestException('Регистрация на турнир закрыта');
    }

    if (tournament.sport.isTeamBased) {
      if (!data.teamId) {
        throw new BadRequestException(
          'Для командного турнира необходимо указать команду',
        );
      }

      const team = await this.teamsService.isUserMember(data.teamId, userId);

      const existingParticipant = await this.participantRepository.findOne({
        where: {
          tournament: { id: tournamentId },
          team: { id: data.teamId },
        },
      });

      if (existingParticipant) {
        throw new BadRequestException(
          'Команда уже зарегистрирована на этот турнир',
        );
      }

      const participant = this.participantRepository.create({
        tournament: { id: tournamentId },
        team: { id: data.teamId },
      });

      return this.participantRepository.save(participant);
    } else {
      if (data.teamId) {
        throw new BadRequestException(
          'Для индивидуального соревнования нельзя указать команду',
        );
      }

      const existingParticipant = await this.participantRepository.findOne({
        where: {
          tournament: { id: tournamentId },
          user: { id: userId },
        },
      });

      if (existingParticipant) {
        throw new BadRequestException('Уже зарегистрирован');
      }

      const participant = this.participantRepository.create({
        tournament: { id: tournamentId },
        user: { id: userId },
      });

      return this.participantRepository.save(participant);
    }
  }

  async getWithFilters(filters: TournamentFilterDto) {
    const where: any = {};

    if (filters.startDate) {
      where.startDate = new Date(filters.startDate);
    }

    if (filters.sportId) {
      where.sport = { id: filters.sportId };
    }

    if (filters.search) {
      where.name = Like(`%${filters.search}%`);
    }

    const tournaments = await this.tournamentRepository.find({
      where,
      relations: ['sport', 'author'],
      order: {
        startDate: 'ASC',
      },
    });

    return tournaments;
  }
}
