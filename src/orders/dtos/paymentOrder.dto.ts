import { IsNotEmpty, IsUUID, IsNumber, IsPositive } from "class-validator";

export class PaymentOrderDto {
        
    @IsNotEmpty()
    @IsUUID()
    paymentId: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    amount: number;

}