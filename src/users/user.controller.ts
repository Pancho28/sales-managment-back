import { Body, Controller, Get, Post, UseGuards, HttpStatus, HttpCode, Put, Param } from '@nestjs/common';
import { UserService } from "./user.service";
import { JwtAuthGuard } from '../authorization/guards';
import { GetUser } from '../authorization/decorators';
import { User } from './entities/user.entity';
import { CreateUserLocalDto, ChangePasswordDto, UpdateDolarlDto } from './dtos';

@Controller('users')
export class UserController {

    constructor(
        private readonly userService: UserService,
    ) {}
    
    @Get()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getUsers(
        @GetUser() user: User
    ): Promise<any> {
        let users: User[];

        users = await this.userService.getUsers(user);

        return {
            statusCode: HttpStatus.OK,
            users
        };
    }

    @Get('/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getUserById(
        @GetUser() user: User,
        @Param('id') id: string
    ): Promise<any> {
        
        const userById = await this.userService.getUserById(id,user);

        delete userById.password;

        return {
            statusCode: HttpStatus.OK,
            user: userById
        };
    }

    @Get('username/:username')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getUserByUsername(
        @GetUser() user: User,
        @Param('username') username: string
    ): Promise<any> {
        
        const userByUsername = await this.userService.getUserByUsername(username,user);

        delete userByUsername.password;

        return {
            statusCode: HttpStatus.OK,
            user: userByUsername
        };
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createUser(
        @GetUser() user: User,
        @Body() data: CreateUserLocalDto
    ): Promise<any> {

        await this.userService.createUser(user,data);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'User created successfully'
        };
    }

    @Put('/activate/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async activateUser(
        @GetUser() user: User,
        @Param('id') id: string,
    ): Promise<any> {

        await this.userService.activateUser(user,id);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'User activated successfully'
        };
    }

    @Put('/inactivate/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async inactivateUser(
        @GetUser() user: User,
        @Param('id') id: string,
    ): Promise<any> {

        await this.userService.inactivateUser(user,id);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'User inactivated successfully'
        };
    }

    @Put('/changepassword/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async changePassword(
        @GetUser() user: User,
        @Param('id') id: string,
        @Body() data: ChangePasswordDto
    ): Promise<any> {

        await this.userService.changePassword(user,id,data.password);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'Password changed successfully'
        };
    }

    @Put('dolar/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async updateDolar(
        @Param('id') id: string,
        @Body() dto: UpdateDolarlDto
    ): Promise<any> {

        await this.userService.updateDolar(id,dto.dolar);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'Dolar updated successfully'
        };
    }

}