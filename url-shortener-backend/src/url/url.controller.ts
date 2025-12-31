import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CreateUrlDTO } from './dto/create-url.dto';
import { UrlService } from './url.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guards';
import { currentUser } from 'src/auth/decorator/currentuser.decorator';
import { User } from 'src/auth/entity/user.entity';
import { AnalyticsDTO } from './dto/analytics.dto';

@Controller('api/url')
export class UrlController {
  constructor(private urlService: UrlService) {}
  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async createUrl(@Body() dto: CreateUrlDTO, @currentUser() user: User) {
    return await this.urlService.createUrl(dto.url, user.id);
  }

  @Get('/list/:short')
  async getUrlById(@Param('short') short: string) {
    return await this.urlService.getUrlById(short);
  }

  @Get('/list')
  @UseGuards(JwtAuthGuard)
  async getUrlList(@currentUser() user: User) {
    return await this.urlService.getUrls(user.id);
  }

  @Get("/increase/:short")
  async increaseUrlCount(@Param("short") short: string) {
    return await this.urlService.increaseCount(short);
  }

  @Get('/analytics/clicks')
  @UseGuards(JwtAuthGuard)
  async getClickAnalytics(@currentUser() user: User) {
    return await this.urlService.getClickAnalytics(user.id)
  }

  @Post('/analytics/clicstatsks')
  @UseGuards(JwtAuthGuard)
  async getAnalytics(@currentUser() user: User, @Body() dto: AnalyticsDTO) {
    return await this.urlService.getAnalytics(user.id, dto)
  }


}
