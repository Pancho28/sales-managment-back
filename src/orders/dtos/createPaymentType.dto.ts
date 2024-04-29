import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreatePaymentTypeDto {
        
    @MaxLength(50)
    @IsNotEmpty()
    @IsString()
    name: string;

    @MaxLength(50)
    @IsNotEmpty()
    @IsString()
    currency: string; 

}