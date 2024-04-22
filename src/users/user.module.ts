import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from "../orders/order.module";
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, Access, UserAccess } from './entities';
import { Local } from "../orders/entities";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Access,
            UserAccess,
            Local
        ]),
        OrderModule
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [ UserService ]
})

export class UserModule {}