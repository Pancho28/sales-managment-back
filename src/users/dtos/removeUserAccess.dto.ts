import { IsNotEmpty, IsUUID } from "class-validator";

export class RemoveUserAccessDto {
        
    @IsNotEmpty()
    @IsUUID()
    userId: string;

    @IsNotEmpty()
    @IsUUID()
    accessId: string;

}