import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateAccessDto {
    
    @MaxLength(50)
    @IsOptional()
    @IsString()
    name: string;

    @MaxLength(50)
    @IsOptional()
    @IsString()
    description: string;

}