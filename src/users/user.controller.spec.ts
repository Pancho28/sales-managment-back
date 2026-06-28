import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../authorization/guards';
import { User } from './entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    getUsers: jest.fn(),
    getUserById: jest.fn(),
    getUserByUsername: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    activateUser: jest.fn(),
    inactivateUser: jest.fn(),
    changePassword: jest.fn(),
    updateDolar: jest.fn(),
    updateLocalName: jest.fn(),
    getAccess: jest.fn(),
    createAccess: jest.fn(),
    updateAccess: jest.fn(),
    assignAccess: jest.fn(),
    removeAccess: jest.fn(),
    changePasswordAccess: jest.fn(),
  };

  const mockUser: User = {
    id: '1',
    username: 'testuser',
    password: 'hashedpassword',
    role: 'seller',
    status: 'ACTIVE',
    tz: 'America/Caracas',
    loginAttempts: 0,
    creationDate: new Date(),
    lastLogin: new Date(),
    email: 'test@test.com',
    userAccess: null,
    local: null,
    hasPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      mockUserService.getUsers.mockResolvedValue([mockUser]);

      const result = await controller.getUsers(mockUser);

      expect(result).toEqual({
        statusCode: 200,
        users: [mockUser],
      });
      expect(service.getUsers).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('getUserById', () => {
    it('should return a single user without password', async () => {
      const userToReturn = { ...mockUser };
      mockUserService.getUserById.mockResolvedValue(userToReturn);

      const result = await controller.getUserById(mockUser, '1');

      expect(result.statusCode).toBe(200);
      expect(result.user).toBeDefined();
      expect(result.user.password).toBeUndefined();
      expect(service.getUserById).toHaveBeenCalledWith('1', mockUser);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createDto: any = { username: 'newuser', password: 'password', tz: 'America/Caracas', email: 'a@a.com' };
      const createdUser = { ...mockUser, id: '2', username: 'newuser' };
      mockUserService.createUser.mockResolvedValue(createdUser);

      const result = await controller.createUser(mockUser, createDto);

      expect(result).toEqual({
        statusCode: 201,
        message: 'Usuario creado exitosamente',
        user: createdUser,
      });
      expect(service.createUser).toHaveBeenCalledWith(mockUser, createDto);
    });
  });

  describe('activateUser', () => {
    it('should activate a user', async () => {
      mockUserService.activateUser.mockResolvedValue(undefined);

      const result = await controller.activateUser(mockUser, '2');

      expect(result).toEqual({
        statusCode: 201,
        message: 'Usuario activado exitosamente',
      });
      expect(service.activateUser).toHaveBeenCalledWith(mockUser, '2');
    });
  });

  describe('updateDolar', () => {
    it('should update local dolar rate', async () => {
      mockUserService.updateDolar.mockResolvedValue(undefined);
      const dto = { dolar: 35.5 };

      const result = await controller.updateDolar('local-1', dto as any);

      expect(result).toEqual({
        statusCode: 201,
        message: 'Dolar actualizado exitosamente',
      });
      expect(service.updateDolar).toHaveBeenCalledWith('local-1', 35.5);
    });
  });

});
