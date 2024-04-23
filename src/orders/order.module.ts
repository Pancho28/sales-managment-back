import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from "../users/user.module";
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order, OrderItem, PaymentType } from "./entities";
import { Local } from "../users/entities";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Order, 
            OrderItem, 
            PaymentType, 
            Local
        ]),
        UserModule
    ],
    controllers: [OrderController],
    providers: [OrderService],
    exports: [ OrderService ]
})

export class OrderModule {}