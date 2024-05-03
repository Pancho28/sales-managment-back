import { IsString, IsNotEmpty, IsUUID, IsOptional } from "class-validator";

export class GrantUserAccessDto {
        
    @IsNotEmpty()
    @IsUUID()
    userId: string;

    @IsNotEmpty()
    @IsUUID()
    accessId: string;

    @IsOptional()
    @IsString()
    password: string;

}