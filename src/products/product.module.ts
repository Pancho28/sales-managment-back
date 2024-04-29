import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from "../users/user.module";
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Category, Product } from "./entities";
import { Local } from "../users/entities";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Category,
            Product,
            Local
        ]),
        UserModule
    ],
    controllers: [ProductController],
    providers: [ProductService],
    exports: [ ProductService ]
})

export class ProductModule {}