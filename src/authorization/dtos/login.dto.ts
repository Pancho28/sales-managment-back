import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class LoginDto {
    
    @IsNotEmpty()
    @IsString()
    username: string;

    @MaxLength(20)
    @IsNotEmpty()
    @IsString()
    password: string;

}