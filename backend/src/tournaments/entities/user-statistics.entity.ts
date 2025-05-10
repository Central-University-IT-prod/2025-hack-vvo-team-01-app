import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { Sport } from './sport.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class UserStatistics {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @ManyToOne(() => User, (user) => user.statistics)
  user: User;

  @ManyToOne(() => Sport, (sport) => sport.userStatistics)
  sport: Sport;

  @Column({ default: 0 })
  @ApiProperty({ description: 'Количество игр' })
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

  updateStatistics() {
    this.winRate =
      this.matchesPlayed > 0 ? (this.wins / this.matchesPlayed) * 100 : 0;
  }
}
