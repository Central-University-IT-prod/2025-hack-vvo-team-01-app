import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { Team } from 'src/teams/entities/team.entity';
import { Participant } from 'src/tournaments/entities/participant.entity';
import { Comment } from 'src/tournaments/entities/comment.entity';
import { UserStatistics } from 'src/tournaments/entities/user-statistics.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ unique: true })
  @ApiProperty()
  telegramId: number;

  @Column({ unique: true })
  @ApiProperty({
    example: 'username',
    description: 'Имя пользователя в Telegram',
  })
  telegramName: string;

  @Column({ nullable: true })
  @ApiPropertyOptional({ example: 'Иван', description: 'Имя' })
  @Expose({ groups: ['profile'] })
  firstName?: string;

  @Column({ nullable: true })
  @ApiPropertyOptional({ example: 'Петров', description: 'Фамилия' })
  @Expose({ groups: ['profile'] })
  lastName?: string;

  @Column({ nullable: true })
  @ApiPropertyOptional({ description: 'URL аватара' })
  avatarUrl?: string;

  @Column({ nullable: true })
  @ApiPropertyOptional({ example: 25, description: 'Возраст' })
  @Expose({ groups: ['profile'] })
  age?: number;

  @Column({ nullable: true })
  @ApiPropertyOptional({ example: 70, description: 'Вес в кг' })
  @Expose({ groups: ['profile'] })
  weight?: number;

  @OneToMany(() => Tournament, (tournament) => tournament.author)
  tournaments: Tournament[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Participant, (participant) => participant.user)
  entries: Participant[];

  @OneToMany(() => UserStatistics, (statistics) => statistics.user)
  @ApiProperty({
    type: () => [UserStatistics],
    description: 'Статистика пользователя',
  })
  @Expose({ groups: ['profile'] })
  statistics: UserStatistics[];

  @ManyToMany(() => Team, (team) => team.members)
  teams: Team[];

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  get fullName() {
    return this.firstName + ' ' + this.lastName;
  }
}
