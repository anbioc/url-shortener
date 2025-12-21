import { Injectable, Logger } from '@nestjs/common';
import { CreateUrlDTO } from './dto/create-url.dto';
import { Url } from './entity/url.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { createShortLink } from 'src/lib/shortener.lib';

@Injectable()
export class UrlService {
  constructor(@InjectRepository(Url) private urlRepository: Repository<Url>) {}

  async createUrl(link: string, id: number) {
    const url = this.urlRepository.create({
      url: link,
      short: createShortLink(),
      clicks: 0,
      user: {
        id: id,
      },
    });

    const result = await this.urlRepository.save(url);

    return {
      success: true,
      message: 'Url saved',
      data: result,
    };
  }

  async getUrlById(short: string) {
    const url = await this.urlRepository.findOne({
      where: {
        short: short,
      },
    });

    if (!url) {
      return {
        success: false,
        message: 'Url not found with the short id provided',
        data: null,
      };
    }

    return {
      success: true,
      message: 'url found',
      data: url,
    };
  }

  async getUrls(userId: number) {
    Logger.log(`userid: ${userId}`)
    try {
      const urls = await this.urlRepository.find({
        where: {
          user: {
            id: userId,
          },
        },
      });

      if (!urls) {
        return {
          success: false,
          message: `No url found with provided user id: ${userId}`,
          data: null,
        };
      }

      return {
        success: true,
        message: 'Url list',
        data: urls,
      };
    } catch (e: any) {
      return {
        success: false,
        message: `Error getting urls: ${e.message}`,
        data: null,
      };
    }
  }

  async increaseCount(short: string) {
    const update = await this.urlRepository.increment(
      {
        short: short,
      },
      'clicks',
      1,
    );
  }
}
