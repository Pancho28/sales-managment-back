import { Injectable, Logger, NotFoundException, OnModuleInit, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User, Local } from "./entities";
import { CreateUserLocalDto, UpdateDolarlDto, ChangePasswordDto } from "./dtos";
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';

@Injectable()
export class UserService implements OnModuleInit{

    logger : Logger;

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Local)
        private localRepository: Repository<Local>,
        private readonly configService: ConfigService
    )
    {
        this.logger = new Logger(UserService.name);
    }

    async onModuleInit() : Promise<void>{
        const username = this.configService.get<string>('ADMIN_USERNAME')
        const password = this.configService.get<string>('ADMIN_PASSWORD')
        const status = this.configService.get<string>('ADMIN_STATUS')
        const role = this.configService.get<string>('ADMIN_ROLE')
        const defaultUser = await this.userRepository
                                        .createQueryBuilder()
                                        .where('username = :username', { username })
                                        .getOne()
        if(!defaultUser){
            const superUser = this.userRepository.create({
                username,
                password,
                status,
                role,
                lastLogin: null
            });
            await this.userRepository.save(superUser);
            this.logger.log(`Creating default user with username ${username}`);
        }
    }

    validateAdmin(user: User) : void {
        if (user.role != 'ADMIN'){
            this.logger.error(`User with username ${user.username} not have permission`);
            throw new UnauthorizedException('Usuario no tiene permiso');
        }
    }
    
    async getUserById(userId: string, admin?: User) : Promise<User> {
        if (admin){
            this.validateAdmin(admin);
        }
        const user = await this.userRepository.findOneBy({id: userId});
        if (!user){
            this.logger.error(`User with id ${userId} not exist`);
            throw new NotFoundException('Usuario no existe');
        }
        return user;
    }
    
    async getUserByUsername(username: string, admin?: User) : Promise<User> {
        if (admin){
            this.validateAdmin(admin);
        }
        const user = await this.userRepository.findOneBy({username});
        if (!user){
            this.logger.error(`User with username ${username} not exist`);
            throw new NotFoundException('Usuario no existe');
        }
        return user;
    }

    async getUsers(user: User) : Promise<User[]> {     
        this.validateAdmin(user);
        const users = await this.userRepository.createQueryBuilder('user')
                                                .where('user.role != :role', { role : 'ADMIN' })
                                                .getMany();
        return users;
    }

    async updateLastLogin(user: User) : Promise<void> {
        user.lastLogin = new Date();
        await this.userRepository.save(user);
    }

    async createUser(user: User, dto: CreateUserLocalDto) : Promise<any> {
        this.validateAdmin(user); 
        const userExist = await this.userRepository.findOneBy({ username: dto.username });
        if (userExist) {
            this.logger.error(`User with username ${userExist.username} already exist`);
            throw new BadRequestException('Usuario ya existe');
        };
        const newUser = this.userRepository.create({
            username: dto.username,
            password: dto.password,
            lastLogin: null
        });
        await this.userRepository.save(newUser);
        this.logger.log(`User with username ${newUser.username} created`);
        const newLocal =  this.localRepository.create({
            name: dto.name,
            dolar: dto.dolar,
            user: newUser
        });
        await this.localRepository.save(newLocal);
        this.logger.log(`Local with name ${newLocal.name} created`); 
        return {newUser, newLocal};
    }

    async activateUser(user: User, id: string) : Promise<void> {
        this.validateAdmin(user);
        const activateUser = await this.getUserById(id);
        activateUser.status = 'ACTIVE';
        await this.userRepository.save(activateUser);
        this.logger.log(`User with username ${activateUser.username} activated`);
    }

    async inactivateUser(user: User, id: string) : Promise<void> {  
        this.validateAdmin(user);
        const inactivateUser = await this.getUserById(id);  
        if (inactivateUser.username === user.username){ 
            this.logger.error(`User with username ${inactivateUser.username} can't be inactivated`);
            throw new BadRequestException('No se puede desactivar este usuario');
        } 
        inactivateUser.status = 'INACTIVE';
        await this.userRepository.save(inactivateUser);
        this.logger.log(`User with username ${inactivateUser.username} inactivated`);
    }

    async changePassword(user: User, id: string, newPassword: string) {
        this.validateAdmin(user);
        const newPasswordUser = await this.getUserById(id);
        newPasswordUser.password = await  hash(newPassword, 10);
        await this.userRepository.save(newPasswordUser);
        this.logger.log(`Password changed for user with username ${newPasswordUser.username}`);
    }

    async updateDolar(localId: string, dolar: number) {
        const local = await this.localRepository.findOneBy({ id: localId });
        if (!local){
            this.logger.error(`Local with id ${localId} not found`);
            throw new NotFoundException(`Local con id ${localId} no encontrado`);
        }
        local.dolar = dolar;
        await this.localRepository.save(local);
        this.logger.log(`Dolar updated for local with name ${local.name}`);
    }

}