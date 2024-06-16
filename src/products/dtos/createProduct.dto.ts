import { IsNumber, IsNotEmpty, IsString, MaxLength, IsUUID, IsEmpty, IsPositive } from "class-validator";

export class CreateProductDto {
        
    @MaxLength(50)
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    price: number;

    @IsNotEmpty()
    @IsUUID()
    categoryId: string;

    @IsNotEmpty()
    @IsUUID()
    localId: string;

}