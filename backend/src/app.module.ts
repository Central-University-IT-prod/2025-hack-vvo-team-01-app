import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { UserModule } from './user/user.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import typeorm from './config/typeorm.config';
import { TeamsModule } from './teams/teams.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    PrometheusModule.register({
      path: '/metrics',
    }),
    TeamsModule,
    TournamentsModule,
    UserModule,
    TelegramModule,
  ],
})
export class AppModule {}
