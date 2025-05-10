import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
  Put,
  SerializeOptions,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';
import { TelegramAuthGuard } from 'src/auth/guards/telegram.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UuidDto } from 'src/common/dto/uuid.dto';

@ApiTags('Пользователи')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('me')
  @ApiOperation({ summary: 'Обновить свои данные' })
  @ApiResponse({
    status: 200,
    description: 'Данные успешно обновлены',
    type: User,
  })
  async updateProfile(
    @Body() dto: UpdateProfileDto,
    @CurrentUser() userId: string,
  ): Promise<User> {
    return this.userService.update(userId, dto);
  }

  @Get('me')
  @SerializeOptions({ groups: ['profile', 'profile:me'] })
  @ApiOperation({ summary: 'Получить свой профиль' })
  @ApiResponse({ status: 200, type: User })
  async getMe(@CurrentUser() userId: string) {
    return this.userService.getById(userId);
  }

  @Get(':id')
  @SerializeOptions({ groups: ['profile'] })
  @ApiOperation({ summary: 'Получить профиль пользователя' })
  @ApiResponse({ status: 200, type: User })
  @ApiParam({ name: 'id', type: String })
  async getById(@Param() { id }: UuidDto) {
    return this.userService.getById(id);
  }
}
