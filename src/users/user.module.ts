import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, Access, UserAccess, Local } from './entities';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Access,
            UserAccess,
            Local
        ])
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [ UserService ]
})

export class UserModule {}