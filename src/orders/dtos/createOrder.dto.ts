import { IsNumber, IsNotEmpty, IsUUID, IsPositive, ValidateNested, IsDate, IsBoolean } from "class-validator";
import { Transform } from 'class-transformer';
import { Type } from 'class-transformer';
import { CreateOrderItemDto, CreatePaymentOrderDto } from "./";

export class CreateOrderDto {
        
    @IsNotEmpty()
    @Transform( ({ value }) => new Date(value))
    @IsDate()
    creationDate: Date;
        
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    totalDl: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    totalBs: number;

    @IsNotEmpty()
    @IsUUID()
    localId: string;

    @IsNotEmpty()
    @IsBoolean()
    delivered: string;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreatePaymentOrderDto)
    payments: CreatePaymentOrderDto[];

}