import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Tournament, TournamentStatus } from './entities/tournament.entity';
import { Match, MatchStatus } from './entities/match.entity';
import { Participant } from './entities/participant.entity';

@Injectable()
export class TournamentCronService {
  private readonly logger = new Logger(TournamentCronService.name);

  constructor(
    @InjectRepository(Tournament)
    private tournamentRepository: Repository<Tournament>,
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async checkTournamentStatuses() {
    this.logger.log('Проверка статусов соревнований...');

    const now = new Date();

    const upcomingTournaments = await this.tournamentRepository.find({
      where: {
        status: TournamentStatus.UPCOMING,
        startDate: Between(new Date(now.getTime() - 300 * 1000), now),
      },
      relations: ['participants'],
    });

    for (const tournament of upcomingTournaments) {
      this.logger.log(`Начало соревнования ${tournament.id}`);

      await this.scheduleMatches(tournament);

      tournament.status = TournamentStatus.ONGOING;
      await this.tournamentRepository.save(tournament);
    }
  }

  private async scheduleMatches(tournament: Tournament): Promise<void> {
    const participants = [...tournament.participants];
    const matches: Match[] = [];

    for (let i = 0; i < participants.length; i++) {
      for (let j = i + 1; j < participants.length; j++) {
        const match = this.matchRepository.create({
          tournament,
          participant1: participants[i],
          participant2: participants[j],
          status: MatchStatus.UPCOMING,
        });
        matches.push(match);
      }
    }

    for (let i = matches.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [matches[i], matches[j]] = [matches[j], matches[i]];
    }

    await this.matchRepository.save(matches);
  }
}
