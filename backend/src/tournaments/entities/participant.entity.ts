import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Tournament } from './tournament.entity';
import { User } from 'src/user/entities/user.entity';
import { Team } from 'src/teams/entities/team.entity';

@Entity()
export class Participant {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @ManyToOne(() => Tournament, (tournament) => tournament.participants)
  @ApiProperty({ type: () => Tournament })
  tournament: Tournament;

  @ManyToOne(() => User, (user) => user.entries, { nullable: true })
  @ApiPropertyOptional({ type: () => User })
  user?: User;

  @ManyToOne(() => Team, (team) => team.entries, { nullable: true })
  @ApiPropertyOptional({ type: () => Team })
  team?: Team;

  @Column({ default: 0 })
  @ApiProperty({ description: 'Очки в турнире' })
  score: number;

  @Column({ default: 0 })
  @ApiProperty({ description: 'Количество сыгранных матчей в турнире' })
  matchesPlayed: number;

  @Column({ default: 0 })
  @ApiProperty({ description: 'Количество побед в турнире' })
  wins: number;

  @Column({ default: 0 })
  @ApiProperty({ description: 'Количество поражений в турнире' })
  losses: number;

  @Column({ default: 0 })
  @ApiProperty({ description: 'Количество ничьих в турнире' })
  draws: number;

  @Column({ default: 0 })
  @ApiProperty({ description: 'Забито голов в турнире' })
  goalsScored: number;

  @Column({ default: 0 })
  @ApiProperty({ description: 'Пропущено голов в турнире' })
  goalsConceded: number;

  @Column({ type: 'float', default: 0 })
  @ApiProperty({ description: 'Процент побед в турнире' })
  winRate: number;

  updateStatistics() {
    this.winRate =
      this.matchesPlayed > 0 ? (this.wins / this.matchesPlayed) * 100 : 0;
  }
}
