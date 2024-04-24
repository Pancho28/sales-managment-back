import { IsNumber, IsNotEmpty, IsUUID, IsPositive, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from "./createOrdemItem.dto";

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
    @IsUUID()
    paymentTypeId: string;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];

}