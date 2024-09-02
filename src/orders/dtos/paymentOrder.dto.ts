import { IsNotEmpty, IsUUID, IsNumber, IsPositive } from "class-validator";

export class PaymentOrderDto {
        
    @IsNotEmpty()
    @IsUUID()
    paymentTypeId: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    amount: number;

}