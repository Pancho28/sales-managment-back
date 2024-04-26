import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UpdateLocalNameDto {
    
    @MaxLength(50)
    @IsNotEmpty()
    @IsString()
    name: string;

}