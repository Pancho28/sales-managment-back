import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateAccessDto {
    
    @MaxLength(20)
    @IsNotEmpty()
    @IsString()
    name: string;

    @MaxLength(50)
    @IsNotEmpty()
    @IsString()
    description: string;

}