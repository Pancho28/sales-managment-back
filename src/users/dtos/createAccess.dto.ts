import { IsNotEmpty, IsString, MaxLength, IsDate } from "class-validator";
import { Transform } from 'class-transformer';

export class CreateAccessDto {
    
    @MaxLength(50)
    @IsNotEmpty()
    @IsString()
    name: string;

    @MaxLength(50)
    @IsNotEmpty()
    @IsString()
    description: string;
        
    @IsNotEmpty()
    @Transform( ({ value }) => new Date(value))
    @IsDate()
    creationDate: Date;

}