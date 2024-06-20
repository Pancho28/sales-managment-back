import { Transform } from 'class-transformer';
import { IsNotEmpty, IsDate, MaxDate } from 'class-validator';

export class DateDto {
        
    @IsNotEmpty()
    @Transform( ({ value }) => new Date(value))
    @IsDate()
    date: Date;

}