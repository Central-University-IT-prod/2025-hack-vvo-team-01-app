import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Sport } from './sport.entity';
import { User } from 'src/user/entities/user.entity';
import { Exclude } from 'class-transformer';
import { Participant } from './participant.entity';
import { Match } from './match.entity';
import { Comment } from './comment.entity';

export enum TournamentType {
  LEAGUE = 'league',
  PLAYOFF = 'playoff',
}

export enum TournamentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  FINISHED = 'finished',
}

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @ManyToOne(() => User, (user) => user.tournaments)
  author: User;

  @Column()
  @ApiProperty({
    example: 'Дворовой чемпионат по футболу',
    description: 'Название',
  })
  name: string;

  @ManyToOne(() => Sport, (sport) => sport.tournaments)
  sport: Sport;

  @Column({ type: 'timestamp' })
  @ApiProperty({
    example: '2025-05-03T00:00:00Z',
    description: 'Начало соревнования',
  })
  startDate: Date;

  @Column({ type: 'timestamp' })
  @ApiProperty({
    example: '2025-05-05T00:00:00Z',
    description: 'Окончание соревнования',
  })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: TournamentType,
    default: TournamentType.LEAGUE,
  })
  @ApiProperty({
    enum: TournamentType,
    example: TournamentType.LEAGUE,
    description: 'Тип',
  })
  type: TournamentType;

  @Column({
    type: 'enum',
    enum: TournamentStatus,
    default: TournamentStatus.PENDING,
  })
  @ApiProperty({
    enum: TournamentStatus,
    example: TournamentStatus.ONGOING,
    description: 'Статус',
  })
  status: TournamentStatus;

  @Column({ type: 'int', nullable: true })
  @ApiPropertyOptional({
    example: 3,
    description: 'Очки за победу',
  })
  pointsForWin?: number;

  @Column({ type: 'int', nullable: true })
  @ApiPropertyOptional({
    example: 1,
    description: 'Очки за ничью',
  })
  pointsForDraw?: number;

  @Column({ type: 'int', nullable: true })
  @ApiPropertyOptional({
    example: 0,
    description: 'Очки за поражение',
  })
  pointsForLoss?: number;

  @Column({ nullable: true })
  @ApiPropertyOptional({
    example: 'Стадион "Динамо"',
    description: 'Место проведения',
  })
  location?: string;

  @Column({ nullable: true })
  @ApiPropertyOptional({
    example: 'https://example.com/tournament-image.jpg',
    description: 'URL изображения',
  })
  image?: string;

  @OneToMany(() => Participant, (participant) => participant.tournament)
  @ApiPropertyOptional({
    type: () => [Participant],
    description: 'Участники турнира',
  })
  participants: Participant[];

  @OneToMany(() => Match, (match) => match.tournament)
  @ApiPropertyOptional({
    type: () => [Match],
    description: 'Матчи турнира',
  })
  matches: Match[];

  @OneToMany(() => Comment, (comment) => comment.tournament)
  @ApiPropertyOptional({
    type: () => [Comment],
    description: 'Комментарии к турниру',
  })
  comments: Comment[];

  get effectivePointsForWin(): number {
    return this.pointsForWin ?? this.sport.pointsForWin;
  }

  get effectivePointsForDraw(): number {
    return this.pointsForDraw ?? this.sport.pointsForDraw;
  }

  get effectivePointsForLoss(): number {
    return this.pointsForLoss ?? this.sport.pointsForLoss;
  }

  get isRegistrationOpen(): boolean {
    return this.status === 'upcoming';
  }
}
