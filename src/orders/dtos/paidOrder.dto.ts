import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested, IsDate } from "class-validator";
import { PaymentOrderDto } from '.';

export class PaidOrderDto {
        
    @IsNotEmpty()
    @Transform( ({ value }) => new Date(value))
    @IsDate()
    date: Date;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => PaymentOrderDto)
    payments: PaymentOrderDto[];

}