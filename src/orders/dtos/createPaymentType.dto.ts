import { IsNotEmpty, IsString, MaxLength, IsUUID } from "class-validator";

export class CreatePaymentTypeDto {
        
    @MaxLength(50)
    @IsNotEmpty()
    @IsString()
    name: string;

    @MaxLength(50)
    @IsNotEmpty()
    @IsString()
    currency: string; 
        
    @IsNotEmpty()
    @IsUUID()
    localId: string;

}