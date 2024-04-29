import { IsNumber, IsNotEmpty, IsString, MaxLength, IsUUID, IsOptional, IsPositive } from "class-validator";

export class UpdateProductDto {

    @IsNotEmpty()
    @IsUUID()
    productId: string;
        
    @MaxLength(50)
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    price: number;

    @IsOptional()
    @IsUUID()
    categoryId: string;

}