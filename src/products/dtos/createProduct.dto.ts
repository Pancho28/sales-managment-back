import { IsNumber, IsNotEmpty, IsString, MaxLength, IsUUID, IsDate, IsPositive } from "class-validator";
import { Transform } from 'class-transformer';

export class CreateProductDto {
        
    @IsNotEmpty()
    @Transform( ({ value }) => new Date(value))
    @IsDate()
    creationDate: Date;
        
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