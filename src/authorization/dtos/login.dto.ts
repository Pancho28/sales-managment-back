import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class LoginDto {
    
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;

    @MaxLength(20)
    @IsNotEmpty()
    @IsString()
    password: string;

}