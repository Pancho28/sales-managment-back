import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class LoginDto {
    
    @MaxLength(20)
    @IsNotEmpty()
    @IsString()
    username: string;

    @MaxLength(20)
    @IsNotEmpty()
    @IsString()
    password: string;

}