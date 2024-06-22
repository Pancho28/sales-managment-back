import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from "../users/user.module";
import { ProductModule } from "../products/product.module";
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order, OrderItem, PaymentType, PaymentOrder, PaymentLocal } from "./entities";
import { Local } from "../users/entities";
import { Product } from "../products/entities";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Order, 
            OrderItem, 
            PaymentType, 
            Local,
            Product,
            PaymentOrder,
            PaymentLocal
        ]),
        UserModule,
        ProductModule
    ],
    controllers: [OrderController],
    providers: [OrderService],
    exports: [ OrderService ]
})

export class OrderModule {}