import { IsNumber, IsNotEmpty, IsString, MaxLength, IsEmpty, IsPositive } from "class-validator";

export class CreateUserLocalDto {
    
    @MaxLength(50)
    @IsNotEmpty()
    @IsString()
    username: string;

    @MaxLength(50)
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