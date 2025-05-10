import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { Sport } from 'src/tournaments/entities/sport.entity';
import { Participant } from 'src/tournaments/entities/participant.entity';
import { TeamStatistics } from 'src/tournaments/entities/team-statistics.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity()
export class Team {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  color: string;

  @Column({ nullable: true })
  @ApiPropertyOptional()
  avatarUrl?: string;

  @Column({ nullable: true })
  @ApiPropertyOptional()
  description?: string;

  @ManyToOne(() => Sport, (sport) => sport.teams)
  sport: Sport;

  @ManyToMany(() => User, (user) => user.teams)
  @JoinTable()
  members: User[];

  @ManyToOne(() => Participant, (participant) => participant.team)
  entries: Participant[];

  @OneToMany(() => TeamStatistics, (statistics) => statistics.team)
  @ApiProperty({
    type: () => [TeamStatistics],
    description: 'Статистика команды',
  })
  statistics: TeamStatistics[];

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;
}
