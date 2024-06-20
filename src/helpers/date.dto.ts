import { Transform } from 'class-transformer';
import { IsNotEmpty, IsDate } from 'class-validator';

export class DateDto {
        
    @IsNotEmpty()
    @Transform( ({ value }) => new Date(value))
    @IsDate()
    date: Date;

}