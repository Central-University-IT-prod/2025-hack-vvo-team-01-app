import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Team } from 'src/teams/entities/team.entity';
import { Sport } from './sport.entity';

@Entity()
export class TeamStatistics {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @ManyToOne(() => Team, (team) => team.statistics)
  @ApiProperty({ type: () => Team })
  team: Team;

  @ManyToOne(() => Sport, (sport) => sport.teamStatistics)
  @ApiProperty({ type: () => Sport })
  sport: Sport;

  @Column({ default: 0 })
  @ApiProperty({ description: 'Количество сыгранных матчей' })
  matchesPlayed: number;

  @Column({ default: 0 })
  @ApiProperty({ description: 'Количество побед' })
  wins: number;

  @Column({ default: 0 })
  @ApiProperty({ description: 'Количество поражений' })
  losses: number;

  @Column({ default: 0 })
  @ApiProperty({ description: 'Количество ничьих' })
  draws: number;

  @Column({ type: 'float', default: 0 })
  @ApiProperty({ description: 'Процент побед' })
  winRate: number;

  @Column({ default: 0 })
  @ApiProperty({ description: 'Общее количество очков' })
  totalPoints: number;

  @Column({ default: 0 })
  @ApiProperty({ description: 'Забито голов' })
  goalsScored: number;

  @Column({ default: 0 })
  @ApiProperty({ description: 'Пропущено голов' })
  goalsConceded: number;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  updateStatistics() {
    this.winRate =
      this.matchesPlayed > 0 ? (this.wins / this.matchesPlayed) * 100 : 0;
  }
}
