import { IsNumber, IsNotEmpty, IsString, MaxLength, IsUUID, IsOptional, IsPositive, IsDate } from "class-validator";
import { Transform } from 'class-transformer';

export class UpdateProductDto {
        
    @IsNotEmpty()
    @Transform( ({ value }) => new Date(value))
    @IsDate()
    updateDate: Date;

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