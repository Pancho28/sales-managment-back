import { Test, TestingModule } from '@nestjs/testing';
import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from './authorization.service';
import { LoginDto } from './dtos/login.dto';
import { LocalAuthGuard } from './guards/local.guard';

describe('AuthorizationController', () => {
  let controller: AuthorizationController;
  let service: AuthorizationService;

  const mockAuthorizationService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorizationController],
      providers: [
        {
          provide: AuthorizationService,
          useValue: mockAuthorizationService,
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthorizationController>(AuthorizationController);
    service = module.get<AuthorizationService>(AuthorizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return login response', async () => {
      const loginDto: LoginDto = { username: 'testuser', password: 'password' };
      const expectedResponse = { accessToken: 'jwt-token', username: 'testuser' };
      
      mockAuthorizationService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual({
        statusCode: 200,
        data: expectedResponse,
      });
      expect(service.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
