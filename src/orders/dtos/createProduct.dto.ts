import { IsNumber, IsNotEmpty, IsString, MaxLength, IsUUID, IsEmpty } from "class-validator";

export class CreateProductDto {
        
    @MaxLength(50)
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsEmpty()
    updateDate: Date; 

    @IsNotEmpty()
    @IsUUID()
    categoryId: string;

}