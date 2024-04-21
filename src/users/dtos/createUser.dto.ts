import { IsEmail, IsNotEmpty, IsString, MaxLength, IsEmpty } from "class-validator";

export class CreateUserDto {
    
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;


    @MaxLength(20)
    @IsNotEmpty()
    @IsString()
    password: string;

    @IsEmpty()
    lastLogin: Date;

}