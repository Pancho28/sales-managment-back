import { Controller, Post, Body, UseGuards, HttpStatus, HttpCode, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { AuthorizationService } from "./authorization.service";
import { LoginDto } from "./dtos/login.dto";
import { LoginSerializer } from "./serialaizers/login.serializer";
import { LocalAuthGuard } from "./guards/local.guard";


@Controller('authorization')
export class AuthorizationController {
    
  constructor(private readonly authorizationService: AuthorizationService) {}

  @Post()
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
  ) : Promise<any> {

    const data = await this.authorizationService.login(loginDto);

    return {
      statusCode: HttpStatus.OK,
      data
    };
  }

}
