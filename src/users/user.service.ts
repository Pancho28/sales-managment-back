import { Injectable, Logger, NotFoundException, OnModuleInit, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dtos/createUser.dto";
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService implements OnModuleInit{

    logger : Logger;

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly configService: ConfigService
    )
    {
        this.logger = new Logger(UserService.name);
    }

    async onModuleInit() : Promise<void>{
        const email = this.configService.get<string>('ADMIN_EMAIL')
        const password = this.configService.get<string>('ADMIN_PASSWORD')
        const status = this.configService.get<string>('ADMIN_STATUS')
        const role = this.configService.get<string>('ADMIN_ROLE')
        const defaultUser = await this.userRepository
                                        .createQueryBuilder()
                                        .where('email = :email', { email })
                                        .getOne()
        if(!defaultUser){
            const superUser = this.userRepository.create({
                email,
                password,
                status,
                role,
                lastLogin: null
            })
            this.logger.log(`Creating default user with email ${email}`)
            await this.userRepository.save(superUser);
        }
    }

    validateAdmin(user: User) : void {
        if (user.role != 'ADMIN'){
            this.logger.error(`User with email ${user.email} not have permission`);
            throw new UnauthorizedException('Usuario no tiene permiso');
        }
    }
    
    async getUserById(id: string, admin?: User) : Promise<User> {
        if (admin){
            this.validateAdmin(admin);
        }
        const user = await this.userRepository.findOneBy({userId: id});
        if (!user){
            this.logger.error(`User with id ${id} not exist`);
            throw new NotFoundException('Usuario no existe');
        }
        return user;
    }
    
    async getUserByEmail(email: string, admin?: User) : Promise<User> {
        if (admin){
            this.validateAdmin(admin);
        }
        const user = await this.userRepository.findOneBy({email: email});
        if (!user){
            this.logger.error(`User with email ${email} not exist`);
            throw new NotFoundException('Usuario no existe');
        }
        return user;
    }

    async getUsers(user: User) : Promise<User[]> {     
        this.validateAdmin(user);
        const users = await this.userRepository.find()
        return users.filter(user => user.role != 'ADMIN');
    }

    async updateLastLogin(user: User) : Promise<void> {
        user.lastLogin = new Date();
        await this.userRepository.save(user);
    }

    async createUser(user: User, dto: CreateUserDto) : Promise<User> {
        this.validateAdmin(user);
        const userExist = await this.userRepository.findOneBy({ email: dto.email });
        if (userExist) {
            this.logger.error(`User with email ${dto.email} already exist`);
            throw new BadRequestException('Usuario ya existe');
        }
        dto.lastLogin = null;
        let newUser: User = this.userRepository.create(dto);
        await this.userRepository.save(newUser);
        this.logger.log(`User with email ${dto.email} created`);
        return newUser;
    }

    async activateUser(user: User, id: string) : Promise<void> {
        this.validateAdmin(user);
        const activateUser = await this.getUserById(id);
        activateUser.status = 'ACTIVE';
        await this.userRepository.save(activateUser);
        this.logger.log(`User with email ${activateUser.email} activated`);
    }

    async inactivateUser(user: User, id: string) : Promise<void> {  
        this.validateAdmin(user);
        const inactivateUser = await this.getUserById(id);  
        if (inactivateUser.email === user.email){ 
            this.logger.error(`User with email ${inactivateUser.email} can't be inactivated`);
            throw new BadRequestException('No se puede desactivar este usuario');
        } 
        inactivateUser.status = 'INACTIVE';
        await this.userRepository.save(inactivateUser);
        this.logger.log(`User with email ${inactivateUser.email} inactivated`);
    }

}