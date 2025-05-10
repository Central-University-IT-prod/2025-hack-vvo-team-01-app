import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Tournament } from './tournament.entity';
import { Participant } from './participant.entity';

export enum MatchStatus {
  UPCOMING = 'upcoming',
  FINISHED = 'finished',
}

export enum MatchResult {
  WIN_1,
  WIN_2,
  DRAW,
}

@Entity()
export class Match {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @ManyToOne(() => Tournament, (tournament) => tournament.matches)
  tournament: Tournament;

  @ManyToOne(() => Participant)
  @ApiProperty({
    type: () => Participant,
    description: 'Участник 1',
  })
  participant1: Participant;

  @ManyToOne(() => Participant)
  @ApiProperty({
    type: () => Participant,
    description: 'Участник 2',
  })
  participant2: Participant;

  @Column({ type: 'timestamp' })
  @ApiProperty({
    type: 'string',
    description: 'Дата и время матча',
  })
  timestamp: Date;

  @Column({
    type: 'enum',
    enum: MatchStatus,
    default: MatchStatus.UPCOMING,
  })
  @ApiProperty({
    enum: MatchStatus,
    description: 'Статус матча',
  })
  status: MatchStatus;

  @Column({ type: 'int', nullable: true })
  @ApiProperty({
    type: 'number',
    description: 'Количество голов участника 1',
  })
  score1: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty({
    type: 'number',
    description: 'Количество голов участника 2',
  })
  score2: number;

  @Column({
    type: 'enum',
    enum: MatchResult,
    nullable: true,
  })
  @ApiProperty({
    enum: MatchResult,
    description: 'Результат матча',
  })
  result: MatchResult;
}
