import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, Local, Access, UserAccess } from './entities';
import { ConfigService } from '@nestjs/config';
import { repositoryMockFactory } from '../helpers/repository-mock.factory';
import { Roles, Status } from '../helpers/enum';
import { UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userRepositoryMock: any;
  let localRepositoryMock: any;
  let accessRepositoryMock: any;
  let userAccessRepositoryMock: any;

  const adminUser = {
    id: 'admin-id',
    username: 'admin',
    role: Roles.ADMIN,
  } as User;

  const normalUser = {
    id: 'user-id',
    username: 'seller',
    role: Roles.SELLER,
    status: Status.ACTIVE,
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Local),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Access),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(UserAccess),
          useFactory: repositoryMockFactory,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mock-value'),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepositoryMock = module.get(getRepositoryToken(User));
    localRepositoryMock = module.get(getRepositoryToken(Local));
    accessRepositoryMock = module.get(getRepositoryToken(Access));
    userAccessRepositoryMock = module.get(getRepositoryToken(UserAccess));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateAdmin', () => {
    it('should not throw if user is admin', () => {
      expect(() => service.validateAdmin(adminUser)).not.toThrow();
    });

    it('should throw UnauthorizedException if user is not admin', () => {
      expect(() => service.validateAdmin(normalUser)).toThrow(UnauthorizedException);
    });
  });

  describe('getUserById', () => {
    it('should return user if found', async () => {
      userRepositoryMock.findOneBy.mockResolvedValue(normalUser);
      const result = await service.getUserById('user-id');
      expect(result).toEqual(normalUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepositoryMock.findOneBy.mockResolvedValue(null);
      await expect(service.getUserById('unknown')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createUser', () => {
    it('should throw BadRequestException if user already exists', async () => {
      userRepositoryMock.findOneBy.mockResolvedValue(normalUser);
      await expect(service.createUser(adminUser, { username: 'seller' } as any))
        .rejects.toThrow(BadRequestException);
    });

    it('should create user and local successfully', async () => {
      userRepositoryMock.findOneBy.mockResolvedValue(null);
      const mockCreatedUser = { ...normalUser, id: 'new-id' };
      const mockCreatedLocal = { name: 'Local 1' };

      userRepositoryMock.create.mockReturnValue(mockCreatedUser);
      localRepositoryMock.create.mockReturnValue(mockCreatedLocal);

      const result = await service.createUser(adminUser, { username: 'newuser', name: 'Local 1', dolar: 35 } as any);

      expect(userRepositoryMock.save).toHaveBeenCalledWith(mockCreatedUser);
      expect(localRepositoryMock.save).toHaveBeenCalledWith(mockCreatedLocal);
      expect(result.username).toBe('seller'); // seller is in normalUser mock
      expect(result.local[0].name).toBe('Local 1');
    });
  });

  describe('activateUser', () => {
    it('should activate user status', async () => {
      const inactiveUser = { ...normalUser, status: Status.INACTIVE };
      userRepositoryMock.findOneBy.mockResolvedValue(inactiveUser);
      
      await service.activateUser(adminUser, 'user-id');

      expect(inactiveUser.status).toBe(Status.ACTIVE);
      expect(userRepositoryMock.save).toHaveBeenCalledWith(inactiveUser);
    });
  });

});
