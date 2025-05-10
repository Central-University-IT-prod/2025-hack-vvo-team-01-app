import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.getById(id);
    return this.userRepository.save({ ...user, ...data });
  }

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['teams', 'statistics'],
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async getByTelegram(telegramName: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { telegramName },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async getOrCreateByTelegramData(
    id: number,
    username: string,
    avatarUrl?: string,
  ): Promise<User> {
    let user = await this.userRepository.findOne({
      where: { telegramId: id },
    });
    if (!user) {
      user = this.userRepository.create({
        telegramId: id,
        telegramName: username,
        avatarUrl,
      });
      await this.userRepository.save(user);
    }

    return user;
  }
}
