import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthorizationService } from '../authorization.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(
        private readonly authorizationService: AuthorizationService
    ) {
        super({
            usernameField: 'username',
            passwordField: 'password',
        })
    }

    async validate(username: string, password: string) {
        const user = await this.authorizationService.validateUser(username, password);
        if (!user) throw new UnauthorizedException('La contraseña es incorrecta');
        return user;
    }
}