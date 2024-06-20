import { IsNotEmpty, IsString, MaxLength, IsDate } from "class-validator";
import { Transform } from 'class-transformer';

export class CategoryDto {
        
    @MaxLength(50)
    @IsNotEmpty()
    @IsString()
    name: string;
        
    @IsNotEmpty()
    @Transform( ({ value }) => new Date(value))
    @IsDate()
    date: Date;

}