import { IsNumber, IsNotEmpty, IsString, MaxLength, IsUUID, IsEmpty } from "class-validator";

export class CategoryDto {
        
    @MaxLength(50)
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsEmpty()
    updateDate: Date; 

}