import { IsNotEmpty, IsString, MaxLength, IsDate } from "class-validator";
import { Transform } from 'class-transformer';

export class LoginDto {
    
    @MaxLength(50)
    @IsNotEmpty()
    @IsString()
    username: string;

    @MaxLength(50)
    @IsNotEmpty()
    @IsString()
    password: string;
        
    @IsNotEmpty()
    @Transform( ({ value }) => new Date(value))
    @IsDate()
    date: Date;

}