import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import { compare } from 'bcrypt';
import { UserService } from '../users/user.service';
import { User, Local, Access } from '../users/entities';
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
      if (user && await compare(password, user.password)){ return user};
      return null;
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

}

