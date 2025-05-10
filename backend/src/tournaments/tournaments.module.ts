import { forwardRef, Module } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { Sport } from './entities/sport.entity';
import { Comment } from './entities/comment.entity';
import { UserModule } from 'src/user/user.module';
import { Participant } from './entities/participant.entity';
import { TeamsModule } from 'src/teams/teams.module';
import { Match } from './entities/match.entity';
import { MatchesService } from './matches.service';
import { TournamentCronService } from './tournament-cron.service';
import { MatchesController } from './matches.controller';
import { SportsService } from './sports.service';
import { SportsController } from './sports.controller';
import { UserStatistics } from './entities/user-statistics.entity';
import { TeamStatistics } from './entities/team-statistics.entity';
import { StatisticsService } from './statistics.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tournament,
      Sport,
      Comment,
      Participant,
      Match,
      UserStatistics,
      TeamStatistics,
    ]),
    forwardRef(() => TeamsModule),
    UserModule,
  ],
  controllers: [TournamentsController, MatchesController, SportsController],
  providers: [
    TournamentsService,
    MatchesService,
    TournamentCronService,
    SportsService,
    StatisticsService,
  ],
  exports: [TournamentsService, SportsService],
})
export class TournamentsModule {}
