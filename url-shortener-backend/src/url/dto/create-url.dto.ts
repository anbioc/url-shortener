import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";


export class CreateUrlDTO {
   @IsString({})
    url: string;
}