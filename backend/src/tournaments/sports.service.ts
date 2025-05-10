import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sport } from './entities/sport.entity';

@Injectable()
export class SportsService {
  constructor(
    @InjectRepository(Sport)
    private sportRepository: Repository<Sport>,
  ) {}

  async getAll(): Promise<Sport[]> {
    return this.sportRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  async getById(id: string): Promise<Sport> {
    const sport = this.sportRepository.findOne({
      where: { id },
    });

    if (!sport) {
      throw new NotFoundException('Вид спорта не найден');
    }

    return sport;
  }
}
