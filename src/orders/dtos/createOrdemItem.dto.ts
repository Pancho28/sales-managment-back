import { IsNumber, IsNotEmpty, IsUUID, IsPositive, IsInt } from "class-validator";

export class CreateOrderItemDto {
        
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    quantity: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    price: number;

    @IsNotEmpty()
    @IsUUID()
    productId: string;

}