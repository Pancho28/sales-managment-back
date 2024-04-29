import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationModule } from './authorization/authorization.module';
import { UserModule } from './users/user.module';
import { OrderModule } from "./orders/order.module";
import { ProductModule } from "./products/product.module";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
        inject: [ConfigService],
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          type: 'mysql',
          host: config.get<string>('DATABASE_HOST'),
          port: parseInt(config.get<string>('DATABASE_PORT'), 10),
          username: config.get<string>('DATABASE_USERNAME'),
          password: config.get<string>('DATABASE_PASSWORD'),
          database: config.get<string>('DATABASE_NAME'),
          entities: [__dirname + './**/**/*ENTITY{.ts,.js}'],
          autoLoadEntities: true,
          synchronize: true,
          logging: true,
          logger: 'file',
        })
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    AuthorizationModule,
    UserModule,
    OrderModule,
    ProductModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
