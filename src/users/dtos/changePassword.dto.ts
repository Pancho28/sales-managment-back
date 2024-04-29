import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class ChangePasswordDto {

    @MaxLength(50)
    @IsNotEmpty()
    @IsString()
    password: string;

}