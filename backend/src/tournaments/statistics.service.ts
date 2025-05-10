import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match, MatchResult } from './entities/match.entity';
import { UserStatistics } from './entities/user-statistics.entity';
import { TeamStatistics } from './entities/team-statistics.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(UserStatistics)
    private userStatisticsRepository: Repository<UserStatistics>,
    @InjectRepository(TeamStatistics)
    private teamStatisticsRepository: Repository<TeamStatistics>,
  ) {}

  async updateStatisticsForMatch(match: Match) {
    if (!match.participant1 || !match.participant2) {
      return;
    }

    const tournament = match.tournament;
    const sport = tournament.sport;

    if (sport.isTeamBased) {
      await this.updateTeamStatistics(match);
    } else {
      await this.updateUserStatistics(match);
    }
  }

  private async updateTeamStatistics(match: Match) {
    const team1 = match.participant1.team;
    const team2 = match.participant2.team;
    const sport = match.tournament.sport;

    const [team1Stats, team2Stats] = await Promise.all([
      this.getOrCreateTeamStatistics(team1.id, sport.id),
      this.getOrCreateTeamStatistics(team2.id, sport.id),
    ]);

    team1Stats.matchesPlayed++;
    team2Stats.matchesPlayed++;

    team1Stats.goalsScored += match.score1;
    team1Stats.goalsConceded += match.score2;
    team2Stats.goalsScored += match.score2;
    team2Stats.goalsConceded += match.score1;

    switch (match.result) {
      case MatchResult.WIN_1:
        team1Stats.wins++;
        team2Stats.losses++;
        break;
      case MatchResult.WIN_2:
        team1Stats.losses++;
        team2Stats.wins++;
        break;
      case MatchResult.DRAW:
        team1Stats.draws++;
        team2Stats.draws++;
        break;
    }

    team1Stats.updateStatistics();
    team2Stats.updateStatistics();

    await this.teamStatisticsRepository.save([team1Stats, team2Stats]);
  }

  private async updateUserStatistics(match: Match) {
    const user1 = match.participant1.user;
    const user2 = match.participant2.user;
    const sport = match.tournament.sport;

    const [user1Stats, user2Stats] = await Promise.all([
      this.getOrCreateUserStatistics(user1.id, sport.id),
      this.getOrCreateUserStatistics(user2.id, sport.id),
    ]);

    user1Stats.matchesPlayed++;
    user2Stats.matchesPlayed++;

    switch (match.result) {
      case MatchResult.WIN_1:
        user1Stats.wins++;
        user2Stats.losses++;
        break;
      case MatchResult.WIN_2:
        user1Stats.losses++;
        user2Stats.wins++;
        break;
      case MatchResult.DRAW:
        user1Stats.draws++;
        user2Stats.draws++;
        break;
    }

    user1Stats.updateStatistics();
    user2Stats.updateStatistics();

    await this.userStatisticsRepository.save([user1Stats, user2Stats]);
  }

  private async getOrCreateUserStatistics(userId: string, sportId: string) {
    let stats = await this.userStatisticsRepository.findOne({
      where: {
        user: { id: userId },
        sport: { id: sportId },
      },
    });

    if (!stats) {
      stats = this.userStatisticsRepository.create({
        user: { id: userId },
        sport: { id: sportId },
      });
    }

    return stats;
  }

  private async getOrCreateTeamStatistics(teamId: string, sportId: string) {
    let stats = await this.teamStatisticsRepository.findOne({
      where: {
        team: { id: teamId },
        sport: { id: sportId },
      },
    });

    if (!stats) {
      stats = this.teamStatisticsRepository.create({
        team: { id: teamId },
        sport: { id: sportId },
      });
    }

    return stats;
  }
}
