import { IsNotEmpty, IsOptional, IsString,  } from "class-validator";

export class CreateCustomerInformationDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    lastName: string;

}