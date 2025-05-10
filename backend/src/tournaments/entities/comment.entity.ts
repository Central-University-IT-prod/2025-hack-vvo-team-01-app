import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Tournament } from './tournament.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @ManyToOne(() => Tournament, (tournament) => tournament.comments)
  tournament: Tournament;

  @ManyToOne(() => User, (user) => user.comments)
  author: User;

  @Column()
  @ApiProperty()
  text: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;
}
