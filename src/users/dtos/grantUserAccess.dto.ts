import { IsBoolean, IsNotEmpty, IsUUID } from "class-validator";

export class GrantUserAccessDto {
        
    @IsNotEmpty()
    @IsUUID()
    userId: string;

    @IsNotEmpty()
    @IsUUID()
    accessId: string;

    @IsNotEmpty()
    @IsBoolean()
    password: boolean;

}