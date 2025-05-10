import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { Team } from './entities/team.entity';
import { UserModule } from 'src/user/user.module';
import { TournamentsModule } from 'src/tournaments/tournaments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team]),
    UserModule,
    forwardRef(() => TournamentsModule),
  ],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}
