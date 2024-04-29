import { IsNumber, IsNotEmpty, IsUUID, IsPositive } from "class-validator";

export class CreatePaymentOrderDto {
        
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    amount: number;

    @IsNotEmpty()
    @IsUUID()
    paymentTypeId: string;

}