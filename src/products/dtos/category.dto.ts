import { IsNotEmpty, IsString, MaxLength, IsEmpty } from "class-validator";

export class CategoryDto {
        
    @MaxLength(50)
    @IsNotEmpty()
    @IsString()
    name: string;

}