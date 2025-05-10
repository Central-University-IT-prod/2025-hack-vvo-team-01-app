import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Context, Ctx, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Markup, Telegraf } from 'telegraf';

@Update()
@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly miniAppUrl: string;

  constructor(
    private configService: ConfigService,
    @InjectBot() private readonly bot: Telegraf,
  ) {
    this.miniAppUrl =
      this.configService.get<string>('TELEGRAM_MINI_APP_URL') ||
      'https://t.me/your_mini_app';
  }

  @Start()
  async start(@Ctx() ctx) {
    this.logger.log('Start command received');
    const welcomeMessage =
      `🎮 Добро пожаловать в бот турнирной системы!\n\n` +
      `Здесь вы будете получать уведомления о:\n` +
      `• Предстоящих матчах\n` +
      `• Результатах турниров\n` +
      `• Регистрациях в турнирах\n\n` +
      `Для управления турнирами используйте мини-приложение:`;

    const keyboard = Markup.inlineKeyboard([
      Markup.button.webApp('Открыть приложение', this.miniAppUrl),
    ]);

    try {
      await ctx.reply(welcomeMessage, keyboard);
      this.logger.log('Welcome message sent');
    } catch (error) {
      this.logger.error(
        `Ошибка при отправке приветственного сообщения:`,
        error,
      );
    }
  }

  async sendMessage(chatId: number, message: string) {
    try {
      await this.bot.telegram.sendMessage(chatId, message);
    } catch (error) {
      this.logger.error(`Ошибка при отправке сообщения: ${chatId}:`, error);
      throw error;
    }
  }
}
