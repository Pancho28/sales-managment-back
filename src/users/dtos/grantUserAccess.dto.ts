import { IsString, IsNotEmpty, IsUUID, IsOptional, IsDate } from "class-validator";
import { Transform } from 'class-transformer';

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
        
    @IsNotEmpty()
    @Transform( ({ value }) => new Date(value))
    @IsDate()
    creationDate: Date;

}