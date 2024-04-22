import { IsNumber, IsNotEmpty, IsString, MaxLength, IsEmail, IsEmpty } from "class-validator";

export class CreateUserLocalDto {
    
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
    
    @MaxLength(50)
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    dolar: number;

}