import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class LoginDto {
    
    @MaxLength(50)
    @IsNotEmpty()
    @IsString()
    username: string;

    @MaxLength(50)
    @IsNotEmpty()
    @IsString()
    password: string;

}