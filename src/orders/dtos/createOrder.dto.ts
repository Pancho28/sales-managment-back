import { IsNumber, IsNotEmpty, IsUUID, IsPositive } from "class-validator";

export class CreateorderDto {
        
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

}