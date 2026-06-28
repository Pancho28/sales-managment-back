import { Test, TestingModule } from '@nestjs/testing';
import { AuthorizationService } from './authorization.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Roles, Status } from '../helpers/enum';
import { User, Local, Access } from '../users/entities';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthorizationService', () => {
  let service: AuthorizationService;
  let userServiceMock: any;
  let jwtServiceMock: any;

  const mockUser: User = {
    id: 'user-1',
    username: 'testuser',
    password: 'hashedpassword',
    status: Status.ACTIVE,
    role: Roles.SELLER,
    tz: 'America/Caracas',
    loginAttempts: 0,
    creationDate: new Date(),
    lastLogin: null,
    email: '',
    userAccess: null,
    local: null,
    hasPassword: jest.fn(),
  };

  const mockLocal = {
    id: 'local-1',
    name: 'Main Local',
    dolar: 35,
    user: mockUser,
  } as Local;

  beforeEach(async () => {
    userServiceMock = {
      getUserByUsername: jest.fn(),
      getLocalByUserId: jest.fn(),
      getAccessByUserId: jest.fn(),
      updateLastLogin: jest.fn(),
      updateLoginAttempts: jest.fn(),
    };

    jwtServiceMock = {
      sign: jest.fn().mockReturnValue('mocked-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorizationService,
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthorizationService>(AuthorizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      userServiceMock.getUserByUsername.mockResolvedValue(null);
      await expect(service.validateUser('unknown', 'pass')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is inactive', async () => {
      const inactiveUser = { ...mockUser, status: Status.INACTIVE };
      userServiceMock.getUserByUsername.mockResolvedValue(inactiveUser);
      await expect(service.validateUser('testuser', 'pass')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException and increase attempts on wrong password', async () => {
      userServiceMock.getUserByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.validateUser('testuser', 'wrongpass')).rejects.toThrow(UnauthorizedException);
      expect(userServiceMock.updateLoginAttempts).toHaveBeenCalledWith(mockUser, 1);
    });

    it('should return user on successful validation', async () => {
      userServiceMock.getUserByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('testuser', 'correctpass');
      expect(result).toEqual(mockUser);
    });
  });

  describe('login', () => {
    it('should return valid login response and update last login', async () => {
      userServiceMock.getUserByUsername.mockResolvedValue(mockUser);
      userServiceMock.getLocalByUserId.mockResolvedValue(mockLocal);
      
      const mockAccess = [{
        id: 'acc-1',
        name: 'Reports',
        userAccess: [{ password: '123' }],
      }] as unknown as Access[];
      
      userServiceMock.getAccessByUserId.mockResolvedValue(mockAccess);

      const loginDto = { username: 'testuser', password: 'password' };
      const result = await service.login(loginDto);

      expect(result.accessToken).toBe('mocked-jwt-token');
      expect(result.username).toBe('testuser');
      expect(result.local.name).toBe('Main Local');
      expect(result.access[0].name).toBe('Reports');
      expect(userServiceMock.updateLastLogin).toHaveBeenCalled();
    });
  });
});
