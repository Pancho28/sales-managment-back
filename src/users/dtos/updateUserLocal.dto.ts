import { IsNumber, IsString, MaxLength, IsPositive, IsOptional, IsEmail } from "class-validator";

export class UpdateUserLocalDto {
    
    @MaxLength(50)
    @IsOptional()
    @IsString()
    username: string;
    
    @MaxLength(50)
    @IsOptional()
    @IsString()
    localName: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    dolar: number;
    
    @MaxLength(50)
    @IsOptional()
    @IsEmail()
    email: string;
    
    @MaxLength(50)
    @IsOptional()
    @IsString()
    tz: string;

}