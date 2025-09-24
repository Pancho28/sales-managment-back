import { IsNumber, IsNotEmpty, IsString, MaxLength, IsDate, IsPositive, IsOptional, IsEmail } from "class-validator";
import { Transform } from 'class-transformer';

export class CreateUserLocalDto {
    
    @MaxLength(50)
    @IsNotEmpty()
    @IsString()
    username: string;

    @MaxLength(50)
    @IsNotEmpty()
    @IsString()
    password: string;
    
    @MaxLength(50)
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    dolar: number;
    
    @MaxLength(50)
    @IsOptional()
    @IsEmail()
    email: string;
        
    @IsNotEmpty()
    @Transform( ({ value }) => new Date(value))
    @IsDate()
    creationDate: Date;

}