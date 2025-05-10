import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { validate, parse } from '@telegram-apps/init-data-node';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TelegramAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.header('Authorization') || '';
    const [authType, authData = ''] = authHeader.split(' ');

    if (this.configService.get<boolean>('TELEGRAM_AUTH_TEST')) {
      const initData = {
        user: {
          id: 123456789,
          username: 'test_user',
          photo_url: 'https://example.com/photo.jpg',
        },
      };

      const user = await this.userService.getOrCreateByTelegramData(
        initData.user.id,
        initData.user.username,
        initData.user.photo_url,
      );
      (request as any).user = user;
      return true;
    }

    if (authType !== 'tma') {
      throw new UnauthorizedException();
    }

    try {
      validate(authData, this.configService.get<string>('TELEGRAM_BOT_TOKEN'), {
        expiresIn: 7200,
      });
      const initData = parse(authData);
      const user = await this.userService.getOrCreateByTelegramData(
        initData.user.id,
        initData.user.username,
        initData.user.photo_url,
      );
      (request as any).userId = user.id;
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
