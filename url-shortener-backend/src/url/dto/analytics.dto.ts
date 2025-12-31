import { Type } from 'class-transformer';
import { IsDate, IsDateString, IsNotEmpty } from 'class-validator';

export class AnalyticsDTO {
  @IsNotEmpty()
  // @IsDateString()
  from: string;

  @IsNotEmpty()
  // @IsDateString()
  to: string;
}
