import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";


export class RegisterDTO {
   @IsEmail({}, {message: "Please provide a valid email"})
    email: string;
    
    @IsNotEmpty({message: "name is required"})
    @MinLength(3, {message: "name min length is 3"})
    @MaxLength(45, {message: "name max length is 45"})
    @IsString({message: "name must be string"})
    fullname: string;

    @IsNotEmpty({message: "Password is required"})
    @MinLength(6, {message: "Password min length is 6"})
    @MaxLength(40, {message: "Password max length is 40"})
    @IsString({message: "Password must be string"})
    // @IsStrongPassword({}, {message: "Password must be a strong one"})
    password: string;
}