import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import { compare } from 'bcrypt';
import { UserService } from '../users/user.service';
import { User, Local, Access } from '../users/entities';
import { Status } from '../helpers/enum';
import * as moment from "moment-timezone";

@Injectable()
export class AuthorizationService {

  logger : Logger;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) 
  {
    this.logger = new Logger(AuthorizationService.name);
  }

  async validateUser(username: string, password: string) {
      const user = await this.userService.getUserByUsername(username);
      if (!user) {
        throw new UnauthorizedException('Usuario no existe');
      }
      if (user.status === Status.INACTIVE) {
        throw new UnauthorizedException('El usuario está inactivo');
      }
      if (!await compare(password, user.password)){ 
        await this.maxLoginAttempts(user);
        throw new UnauthorizedException('La contraseña es incorrecta');
      };
      return user;
  }

  async login( loginDto : LoginDto ) : Promise<any> { 
    const user: User = await this.userService.getUserByUsername(loginDto.username); 
    const local: Local = await this.userService.getLocalByUserId(user);
    const access: Access[] = await this.userService.getAccessByUserId(user);
    const accesUser = [];
    access.forEach((acces)=>{
      accesUser.push({
        id: acces.id,
        name: acces.name,
        pass : acces.userAccess[0] ?  acces.userAccess[0].password : null
      })
    })
    const {id, username, role, tz} = user;
    const payload = { sub: id };
    const response = {
      id,
      username,
      role,
      tz,
      local: local ? local : null,
      access: accesUser,
      accessToken: this.jwtService.sign(payload)
    } 
    const date = new Date(moment().tz(tz).format());
    this.userService.updateLastLogin(user, date);
    this.logger.log(`Login attempt with username: ${loginDto.username} at ${date}`);
    return response;
  }

  async maxLoginAttempts(user: User): Promise<any> {
    await this.userService.updateLoginAttempts(user, user.loginAttempts + 1);
  }

}

