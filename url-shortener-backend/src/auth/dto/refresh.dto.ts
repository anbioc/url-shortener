import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RefreshDTO {
  @IsNotEmpty({ message: 'name is required' })
  @IsString({ message: 'name must be string' })
  refreshtoken: string;
}
