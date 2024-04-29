import { Body, Controller, Get, Post, UseGuards, HttpStatus, HttpCode, Put, Param } from '@nestjs/common';
import { UserService } from "./user.service";
import { JwtAuthGuard } from '../authorization/guards';
import { GetUser } from '../authorization/decorators';
import { User } from './entities/user.entity';
import { CreateUserLocalDto, ChangePasswordDto, UpdateDolarlDto, CreateAccessDto, 
    UpdateAccessDto, GrantUserAccessDto, RemoveUserAccessDto, UpdateLocalNameDto } from './dtos';

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
        @Param('id') userId: string
    ): Promise<any> {
        
        const userById = await this.userService.getUserById(userId,user);

        delete userById.password;

        return {
            statusCode: HttpStatus.OK,
            user: userById
        };
    }

    @Get('/username/:username')
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
        @Param('id') userId: string,
    ): Promise<any> {

        await this.userService.activateUser(user,userId);

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
        @Param('id') userId: string,
    ): Promise<any> {

        await this.userService.inactivateUser(user,userId);

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
        @Param('id') userId: string,
        @Body() data: ChangePasswordDto
    ): Promise<any> {

        await this.userService.changePassword(user,userId,data.password);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'Password changed successfully'
        };
    }

    @Put('/dolar/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async updateDolar(
        @Param('id') localId: string,
        @Body() dto: UpdateDolarlDto
    ): Promise<any> {

        await this.userService.updateDolar(localId,dto.dolar);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'Dolar updated successfully'
        };
    }

    @Put('/local/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async updateLocal(
        @Param('id') localId: string,
        @Body() dto: UpdateLocalNameDto
    ): Promise<any> {

        await this.userService.updateLocalName(localId,dto.name);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'Local name updated successfully'
        };
    }

    @Post('/access')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createAccess(
        @GetUser() user: User,
        @Body() dto: CreateAccessDto
    ): Promise<any> {

        await this.userService.createAccess(user,dto);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'Access created'
        };
    }

    @Put('/access/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async updateAccess(
        @GetUser() user: User,
        @Param('id') accessId: string,
        @Body() dto: UpdateAccessDto
    ): Promise<any> {

        await this.userService.updateAccess(user,accessId,dto);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'Access updated'
        };
    }

    @Post('/assignaccess')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async assignAccess(
        @GetUser() user: User,
        @Body() dto: GrantUserAccessDto
    ): Promise<any> {

        await this.userService.assignAccess(user,dto);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'Access assigned'
        };
    }

    @Post('/removeaccess')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async removeAccess(
        @GetUser() user: User,
        @Body() dto: RemoveUserAccessDto
    ): Promise<any> {

        await this.userService.removeAccess(user,dto);

        return {
            statusCode: HttpStatus.OK,
            message: 'Access removed'
        };
    }

    @Put('/assignaccess')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async changePasswordAccess(
        @GetUser() user: User,
        @Body() dto: GrantUserAccessDto
    ): Promise<any> {

        await this.userService.changePasswordAccess(user,dto);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'Password changed'
        };
    }

}