import { Injectable, Logger } from '@nestjs/common';
import { CreateUrlDTO } from './dto/create-url.dto';
import { Url } from './entity/url.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { createShortLink } from 'src/lib/shortener.lib';
import { AnalyticsDTO } from './dto/analytics.dto';
import { AnalyticsData } from './type/analytics.type';
import { getRandomInt } from 'src/lib/number.util';

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
    Logger.log(`userid: ${userId}`);
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
    const increment = await this.urlRepository.increment(
      {
        short: short,
      },
      'clicks',
      1,
    );

    const update = await this.urlRepository.update(
      {
        short: short,
      },
      {
        updatedAt: new Date(),
      },
    );

    return {
      success: true,
      message: 'Click count updated',
      data: update,
    };
  }

  async getClickAnalytics(userId: number) {
    try {
      const urls = await this.urlRepository.find({
        where: {
          user: {
            id: userId,
          },
        },
      });

      if (!urls || urls.length == 0) {
        return {
          success: true,
          data: {
            clicks: 0,
            urls: 0,
            sales: 0,
            leads: 0,
          },
          message: 'No url found',
          error: null,
        };
      }

      let clicks = 0;
      let urlCount = 0;
      urls.forEach((url) => {
        clicks += url.clicks;
        urlCount++;
      });

      return {
        success: true,
        data: {
          clicks: clicks,
          urls: urlCount,
          sales: 0,
          leads: 0,
        },
        message: 'url and click count data',
        error: null,
      };
    } catch (e) {
      return {
        success: false,
        data: {
          clicks: 0,
          urls: 0,
          sales: 0,
          leads: 0,
        },
        message: `Soemthing went wrong: ${e.message}`,
        error: e.message,
      };
    }
  }

  async getAnalytics(id: number, dto: AnalyticsDTO){
    try {
      const result = await this.urlRepository.find({
        where: {
          user: {
            id: id
          }
        },
        order: {
          updatedAt: 'DESC',
        },
      });

      let total = 0;
      const grouped: Map<string, number> = result.reduce(
        (acc, url) => {
          // Normalize to YYYY-MM-DD
          const dateKey = url.updatedAt.toISOString().split('T')[0];

          if (!acc[dateKey]) {
            acc[dateKey] = 0;
          }
          total += url.clicks;
          acc[dateKey] = acc[dateKey] + url.clicks;
          return acc;
        },
        {} as Map<string, number>,
      );


      
      return {
        success: true,
        message: 'clicks per day',
        data: {
          stats: grouped,
          total_clicks: total,
          leads: getRandomInt(20, 200),
          sales: getRandomInt(26, 223)
        },
      };
    } catch (e) {
      return {
        success: false,
        data: null,
        message: `Soemthing went wrong: ${e.message}`,
        error: e.message,
      };
    }
  }

  // async getAnalytics(id: number, dto: AnalyticsDTO) {
  //   try {
  //     const result = await this.urlRepository
  //       .createQueryBuilder('url')
  //       .select('DATE(url.updatedAt)', 'date')
  //       .addSelect('COUNT(url.clicks)', 'total')
  //       .groupBy('DATE(url.updatedAt)')
  //       .orderBy('date', 'DESC')
  //       .getRawMany();

  //     const r = result.map((row) => ({
  //       date: row.date,
  //       total: Number(row.total)
  //     }));

  //     return {
  //       success: true,
  //       message: 'clicks per day',
  //       data: r,
  //     };
  //   } catch (e) {
  //     return {
  //       success: false,
  //       data: null,
  //       message: `Soemthing went wrong: ${e.message}`,
  //       error: e.message,
  //     };
  //   }
  // }

  // async getAnalytics(id: number, dto: AnalyticsDTO) {
  //   try {
  //     const result = await this.urlRepository.find({
  //       order: {
  //         updatedAt: 'DESC',
  //       },
  //     });

  //     const grouped = result.reduce(
  //       (acc, url) => {
  //         // Normalize to YYYY-MM-DD
  //         const dateKey = url.createdAt.toISOString().split('T')[0];

  //         if (!acc[dateKey]) {
  //           acc[dateKey] = [];
  //         }

  //         acc[dateKey].push(url);
  //         return acc;
  //       },
  //       {} as Record<string, Url[]>,
  //     );

  //     return {
  //       success: true,
  //       message: 'clicks per day',
  //       data: grouped,
  //     };
  //   } catch (e) {
  //     return {
  //       success: false,
  //       data: null,
  //       message: `Soemthing went wrong: ${e.message}`,
  //       error: e.message,
  //     };
  //   }
  // }
}

