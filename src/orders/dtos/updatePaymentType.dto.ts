import { IsString, MaxLength, IsOptional } from "class-validator";

export class UpdatePaymentTypeDto {
        
    @MaxLength(50)
    @IsOptional()
    @IsString()
    name: string;

    @MaxLength(50)
    @IsOptional()
    @IsString()
    currency: string; 

}