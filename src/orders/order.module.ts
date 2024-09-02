import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from "../users/user.module";
import { ProductModule } from "../products/product.module";
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Orders, OrderItem, PaymentType, PaymentOrder, PaymentLocal, CustomerInformation } from "./entities";
import { Local } from "../users/entities";
import { Product } from "../products/entities";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Orders, 
            OrderItem, 
            PaymentType, 
            Local,
            Product,
            PaymentOrder,
            PaymentLocal,
            CustomerInformation
        ]),
        UserModule,
        ProductModule
    ],
    controllers: [OrderController],
    providers: [OrderService],
    exports: [ OrderService ]
})

export class OrderModule {}