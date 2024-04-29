import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { UserModule } from "../users/user.module";
import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from './authorization.service';
import { LocalStrategy, JwtStrategy } from './strategies';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1440m'}
      })
    })],
  controllers: [AuthorizationController],
  providers: [
    AuthorizationService,
    LocalStrategy,
    JwtStrategy],
})
export class AuthorizationModule {}
