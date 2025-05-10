import { Team } from 'src/teams/entities/team.entity';
import { Tournament } from 'src/tournaments/entities/tournament.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatistics } from './user-statistics.entity';
import { TeamStatistics } from './team-statistics.entity';

export enum ScoringType {
  GOALS = 'goals',
  WIN_LOSE = 'win_lose',
}

@Entity()
export class Sport {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty({
    description: 'Название',
    example: 'Футбол',
  })
  name: string;

  @Column({
    type: 'enum',
    enum: ScoringType,
    default: ScoringType.GOALS,
  })
  @ApiProperty({
    enum: ScoringType,
    description: 'Тип подсчета очков',
    example: ScoringType.GOALS,
  })
  scoringType: ScoringType;

  @Column({ default: false })
  @ApiProperty({
    description: 'Командный вид спорта',
    example: true,
  })
  isTeamBased: boolean;

  @Column({ default: 3 })
  @ApiProperty({
    description: 'Количество очков за победу',
    example: 3,
  })
  pointsForWin: number;

  @Column({ default: 1 })
  @ApiProperty({
    description: 'Количество очков за ничью',
    example: 1,
  })
  pointsForDraw: number;

  @Column({ default: 0 })
  @ApiProperty({
    description: 'Количество очков за поражение',
    example: 0,
  })
  pointsForLoss: number;

  @OneToMany(() => Tournament, (tournament) => tournament.sport)
  tournaments: Tournament[];

  @OneToMany(() => Team, (team) => team.sport)
  teams: Team[];

  @OneToMany(() => UserStatistics, (statistics) => statistics.sport)
  userStatistics: UserStatistics[];

  @OneToMany(() => TeamStatistics, (statistics) => statistics.sport)
  teamStatistics: TeamStatistics[];

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
