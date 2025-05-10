import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match, MatchStatus, MatchResult } from './entities/match.entity';
import { RecordMatchResultDto } from './dto/record-match-result.dto';
import { StatisticsService } from './statistics.service';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private statisticsService: StatisticsService,
  ) {
    console.log(123);
  }

  async recordMatchResult(
    userId: string,
    matchId: string,
    data: RecordMatchResultDto,
  ) {
    const match = await this.matchRepository.findOne({
      where: { id: matchId },
      relations: {
        tournament: {
          author: true,
          sport: true,
        },
        participant1: {
          user: true,
          team: true,
        },
        participant2: {
          user: true,
          team: true,
        },
      },
    });

    if (!match) {
      throw new NotFoundException('Матч не найден');
    }

    if (match.tournament.author.id !== userId) {
      throw new BadRequestException('Нет доступа');
    }

    if (match.status === MatchStatus.FINISHED) {
      throw new BadRequestException('Игра уже завершена');
    }

    const updatedMatch = await this.matchRepository.save({
      ...match,
      ...data,
      status: MatchStatus.FINISHED,
    });

    await this.statisticsService.updateStatisticsForMatch(updatedMatch);

    return updatedMatch;
  }
}
