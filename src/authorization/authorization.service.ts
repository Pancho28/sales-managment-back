import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import { compare, hash } from 'bcrypt';
import { UserService } from '../users/user.service';
import { User } from '../users/entities/user.entity';

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
    const {id, username, role, status} = user;
    const payload = { sub: id };
    const response = {
      id,
      username,
      role,
      status,
      accessToken: this.jwtService.sign(payload)
    } 
    await this.userService.updateLastLogin(user);
    this.logger.log(`Login attempt with username: ${loginDto.username}`);
    return response;
  }

}

