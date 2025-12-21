import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CreateUrlDTO } from './dto/create-url.dto';
import { UrlService } from './url.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guards';
import { currentUser } from 'src/auth/decorator/currentuser.decorator';
import { User } from 'src/auth/entity/user.entity';

@Controller('api/url')
export class UrlController {
  constructor(private urlService: UrlService) {}
  @Post('/create')
  @UseGuards(JwtAuthGuard)
  createUrl(@Body() dto: CreateUrlDTO, @currentUser() user: User) {
    return this.urlService.createUrl(dto.url, user.id);
  }

  @Get('/list/:short')
  getUrlById(@Param('short') short: string) {
    return this.urlService.getUrlById(short);
  }

  @Get('/list')
  @UseGuards(JwtAuthGuard)
  getUrlList(@currentUser() user: User) {
    return this.urlService.getUrls(user.id);
  }

  @Get("/increase/:short")
  increaseUrlCount(@Param("short") short: string) {
    return this.urlService.increaseCount(short);
  }
}
