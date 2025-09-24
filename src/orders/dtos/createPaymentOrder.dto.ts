import { IsNumber, IsNotEmpty, IsUUID, IsPositive, IsBoolean, IsOptional, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';
import { CreateCustomerInformationDto } from "./";

export class CreatePaymentOrderDto {
        
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    amount: number;

    @IsNotEmpty()
    @IsUUID()
    paymentTypeId: string;

    @IsNotEmpty()
    @IsBoolean()
    isPaid: boolean;

    @IsOptional()
    @ValidateNested()
    @Type(() => CreateCustomerInformationDto)
    customer: CreateCustomerInformationDto;

}