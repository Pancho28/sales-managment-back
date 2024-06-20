import { Injectable, Logger, NotFoundException, OnModuleInit, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User, Local, Access, UserAccess } from "./entities";
import { CreateUserLocalDto, CreateAccessDto, UpdateAccessDto, GrantUserAccessDto, RemoveUserAccessDto } from "./dtos";
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { Roles } from "../helpers/enum";

@Injectable()
export class UserService implements OnModuleInit{

    logger : Logger;

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Local)
        private localRepository: Repository<Local>,
        @InjectRepository(Access)
        private accessRepository: Repository<Access>,
        @InjectRepository(UserAccess)
        private userAccessRepository: Repository<UserAccess>,
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
                role 
            });
            await this.userRepository.save(superUser);
            this.logger.log(`Creating default user with username ${username}`);
        }
    }

    validateAdmin(user: User) : void {
        if (user.role != Roles.ADMIN){
            throw new UnauthorizedException(`Usuario ${user.username} no tiene permiso`);
        }
    }
    
    async getUserById(userId: string, admin?: User) : Promise<User> {
        if (admin){
            this.validateAdmin(admin);
        }
        const user = await this.userRepository.findOneBy({id: userId});
        if (!user){
            throw new NotFoundException(`Usuario ${userId} no existe`);
        }
        return user;
    }
    
    async getUserByUsername(username: string, admin?: User) : Promise<User> {
        if (admin){
            this.validateAdmin(admin);
        }
        const user = await this.userRepository.findOneBy({username});
        if (!user){
            throw new NotFoundException(`Usuario ${username} no existe`);
        }
        if (user.status === 'INACTIVE' && admin.role != Roles.ADMIN){
            throw new BadRequestException(`Usuario ${user.id} inactivo`);
        }
        return user;
    }

    async getUsers(user: User) : Promise<User[]> {     
        this.validateAdmin(user);
        const users = await this.userRepository.createQueryBuilder('user')
                                                .where('user.role != :role', { role : Roles.ADMIN })
                                                .getMany();
        return users;
    }

    async getLocalByUserId(user: User) : Promise<Local> {
        const local = await this.localRepository.createQueryBuilder('local')
                                                .select(['local.id', 'local.name', 'local.dolar'])
                                                .where('local.user = :userId', { userId: user.id })
                                                .getOne();
        if (!local && user.role != Roles.ADMIN){
            throw new NotFoundException(`Local no encontrado para usuario con id ${user.id}`);
        }
        return local;
    }

    async getAccessByUserId(user: User) : Promise<Access[]> {
        const access = await this.accessRepository.createQueryBuilder('access')
                                                .select(['access.id', 'access.name', 'userAccess.password'])
                                                .innerJoin('access.userAccess', 'userAccess')
                                                .where('userAccess.userId = :userId', { userId: user.id })
                                                .getMany();
        return access;
    }

    async updateLastLogin(user: User, date: Date) : Promise<void> {
        user.lastLogin = date;
        await this.userRepository.save(user);
    }

    async createUser(user: User, dto: CreateUserLocalDto) : Promise<any> {
        this.validateAdmin(user); 
        const userExist = await this.userRepository.findOneBy({ username: dto.username });
        if (userExist) {
            throw new BadRequestException(`Usuario ${user.id} ya existe`);
        };
        const newUser = this.userRepository.create({
            username: dto.username,
            password: dto.password,
            creationDate: dto.creationDate
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

    async activateUser(user: User, userId: string) : Promise<void> {
        this.validateAdmin(user);
        const activateUser = await this.getUserById(userId);
        if (!activateUser){
            throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
        }
        activateUser.status = 'ACTIVE';
        await this.userRepository.save(activateUser);
        this.logger.log(`User with username ${activateUser.username} activated`);
    }

    async inactivateUser(user: User, userId: string) : Promise<void> {  
        this.validateAdmin(user);
        const inactivateUser = await this.getUserById(userId);  
        if (!inactivateUser){
            throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
        }
        if (inactivateUser.username === user.username){ 
            throw new BadRequestException('No se puede desactivar este usuario');
        } 
        inactivateUser.status = 'INACTIVE';
        await this.userRepository.save(inactivateUser);
        this.logger.log(`User with username ${inactivateUser.username} inactivated`);
    }

    async changePassword(user: User, userId: string, newPassword: string) {
        this.validateAdmin(user);
        const newPasswordUser = await this.getUserById(userId);
        if (!newPasswordUser){
            throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
        }
        newPasswordUser.password = await  hash(newPassword, 10);
        await this.userRepository.save(newPasswordUser);
        this.logger.log(`Password changed for user with username ${newPasswordUser.username}`);
    }

    async updateDolar(localId: string, dolar: number) {
        const local = await this.localRepository.findOneBy({ id: localId });
        if (!local){
            throw new NotFoundException(`Local con id ${localId} no encontrado`);
        }
        local.dolar = dolar;
        await this.localRepository.save(local);
        this.logger.log(`Dolar updated for local with name ${local.name}`);
    }

    async updateLocalName(localId: string, name: string) {
        const local = await this.localRepository.findOneBy({ id: localId });
        if (!local){
            throw new NotFoundException(`Local con id ${localId} no encontrado`);
        }
        local.name = name;
        await this.localRepository.save(local);
        this.logger.log(`Name updated for local with name ${name}`);
    }

    async createAccess(user: User, access: CreateAccessDto) : Promise<void> {
        this.validateAdmin(user);
        const accessExist = await this.accessRepository.findOneBy({ name: access.name });
        if (accessExist){
            throw new BadRequestException(`Acceso con nombre ${accessExist.name} ya existe`);
        }
        const newAccess = this.accessRepository.create({
            name: access.name,
            description: access.description,
            creationDate: access.creationDate
        });
        await this.accessRepository.save(newAccess);
        this.logger.log(`Access with name ${newAccess.name} created`);
    }

    async updateAccess(user: User, accessId: string, access: UpdateAccessDto) : Promise<void> {
        this.validateAdmin(user);
        if (!access.name && !access.description){
            throw new BadRequestException('Nombre o descripción es requerido para actualizar acceso');
        }
        const accessExist = await this.accessRepository.findOneBy({ id: accessId });
        if (!accessExist){
            throw new NotFoundException(`Acceso con id ${accessId} no encontrado`);
        }
        if (access.name == accessExist.name){
            throw new BadRequestException(`Acceso con nombre ${access.name} ya existe`);
        }
        accessExist.name ? accessExist.name = access.name : null;
        accessExist.description ? accessExist.description = access.description : null;
        await this.accessRepository.save(accessExist);
        this.logger.log(`Access ${accessExist.name} updated`);
    }

    async assignAccess(user: User, data: GrantUserAccessDto) : Promise<void> {
        this.validateAdmin(user);
        const userExist = await this.getUserById(data.userId);
        if (!userExist){
            throw new NotFoundException(`Usuario con id ${data.userId} no encontrado`);
        }
        const accessExist = await this.accessRepository.findOneBy({ id: data.accessId });
        if (!accessExist){
            throw new NotFoundException(`Acceso con id ${data.accessId} no encontrado`);
        }
        const userAccessExist = await this.userAccessRepository.createQueryBuilder('userAccess')
                                                            .where('userAccess.userId = :userId', { userId: data.userId })
                                                            .andWhere('userAccess.accessId = :accessId', { accessId: data.accessId })
                                                            .getOne();
        if (userAccessExist){
            throw new BadRequestException(`Usuario ${userExist.username} ya tiene acceso a ${accessExist.name}`);
        }
        const userAccess = this.userAccessRepository.create({
            user: userExist,
            access: accessExist,
            password: data.password,
            creationDate: data.creationDate
        });
        await this.userAccessRepository.save(userAccess);
        this.logger.log(`Access ${accessExist.name} asign to user ${userExist.username}`);
    }

    async removeAccess(user: User, data: RemoveUserAccessDto) : Promise<void> {
        this.validateAdmin(user);
        const userExist = await this.getUserById(data.userId);
        if (!userExist){
            throw new NotFoundException(`Usuario con id ${data.userId} no encontrado`);
        }
        const accessExist = await this.accessRepository.findOneBy({ id: data.accessId });
        if (!accessExist){
            throw new NotFoundException(`Acceso con id ${data.accessId} no encontrado`);
        }
        const userAccessExist = await this.userAccessRepository.createQueryBuilder('userAccess')
                                                            .where('userAccess.userId = :userId', { userId: data.userId })
                                                            .andWhere('userAccess.accessId = :accessId', { accessId: data.accessId })
                                                            .getOne();
        if (!userAccessExist){
            throw new BadRequestException(`Usuario ${userExist.username} no tiene acceso a ${accessExist.name}`);
        }
        await this.userAccessRepository.remove(userAccessExist);
        this.logger.log(`Access ${accessExist.name} remove to user ${userExist.username}`);
    }

    async changePasswordAccess(user: User, data: GrantUserAccessDto) : Promise<void> {
        this.validateAdmin(user);
        const userExist = await this.getUserById(data.userId);
        if (!userExist){
            throw new NotFoundException(`Usuario con id ${data.userId} no encontrado`);
        }
        const accessExist = await this.accessRepository.findOneBy({ id: data.accessId });
        if (!accessExist){
            throw new NotFoundException(`Acceso con id ${data.accessId} no encontrado`);
        }
        const userAccessExist = await this.userAccessRepository.createQueryBuilder('userAccess')
                                                            .where('userAccess.userId = :userId', { userId: data.userId })
                                                            .andWhere('userAccess.accessId = :accessId', { accessId: data.accessId })
                                                            .getOne();
        if (!userAccessExist){
            throw new BadRequestException(`Usuario ${userExist.username} no tiene acceso a ${accessExist.name}`);
        }
        if (userAccessExist.password == data.password){
            throw new BadRequestException(`Clase de acceso ${accessExist.name} ya es ${data.password}`);
        }
        userAccessExist.password = data.password;
        await this.userAccessRepository.save(userAccessExist);
        this.logger.log(`Password access ${accessExist.name} change to user ${userExist.username}`);
    }

}