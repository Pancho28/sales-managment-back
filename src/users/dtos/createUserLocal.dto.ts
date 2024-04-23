import { IsNumber, IsNotEmpty, IsString, MaxLength, IsEmpty, IsPositive } from "class-validator";

export class CreateUserLocalDto {
    
    @IsNotEmpty()
    @IsString()
    username: string;

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
    @IsPositive()
    dolar: number;

}