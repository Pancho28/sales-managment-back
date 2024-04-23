import { IsNumber, IsNotEmpty, IsPositive } from "class-validator";


export class UpdateDolarlDto {

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    dolar: number;

}