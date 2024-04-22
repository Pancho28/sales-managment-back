import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class ChangePasswordDto {

    @MaxLength(20)
    @IsNotEmpty()
    @IsString()
    password: string;

}