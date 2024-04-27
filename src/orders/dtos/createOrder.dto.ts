import { IsNumber, IsNotEmpty, IsUUID, IsPositive, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';
import { CreateOrderItemDto, CreatePaymentOrderDto } from "./";

export class CreateOrderDto {
        
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
    @ValidateNested()
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreatePaymentOrderDto)
    payments: CreatePaymentOrderDto[];

}