import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Category, Local, Order, OrderItem, PaymentType, Product } from "./entities";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Category, 
            Local, 
            Order, 
            OrderItem, 
            PaymentType, 
            Product
        ])
    ],
    controllers: [OrderController],
    providers: [OrderService],
    exports: [ OrderService ]
})

export class OrderModule {}