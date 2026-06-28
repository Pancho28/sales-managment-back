import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Orders, OrderItem, PaymentType, PaymentOrder, PaymentLocal, CustomerInformation } from './entities';
import { Local, User } from '../users/entities';
import { ProductService } from '../products/product.service';
import { repositoryMockFactory } from '../helpers/repository-mock.factory';
import { Roles } from '../helpers/enum';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepoMock: any;
  let localRepoMock: any;
  let productServiceMock: any;

  const mockAdminUser = { id: 'admin-1', username: 'admin', role: Roles.ADMIN } as User;
  const mockSellerUser = { id: 'seller-1', username: 'seller', role: Roles.SELLER } as User;

  beforeEach(async () => {
    productServiceMock = {
      getProducts: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: ProductService, useValue: productServiceMock },
        { provide: getRepositoryToken(Orders), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(OrderItem), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(PaymentType), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(PaymentLocal), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(PaymentOrder), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(Local), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(CustomerInformation), useFactory: repositoryMockFactory },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepoMock = module.get(getRepositoryToken(Orders));
    localRepoMock = module.get(getRepositoryToken(Local));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrders', () => {
    it('should throw UnauthorizedException if not admin', async () => {
      await expect(service.getOrders(mockSellerUser)).rejects.toThrow(UnauthorizedException);
    });

    it('should return orders for admin', async () => {
      orderRepoMock.createQueryBuilder.mockReturnValue({
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      });

      const result = await service.getOrders(mockAdminUser);
      expect(result).toEqual([]);
      expect(orderRepoMock.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('getOrdersByLocal', () => {
    it('should throw NotFoundException if local not found', async () => {
      localRepoMock.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getOrdersByLocal('invalid')).rejects.toThrow(NotFoundException);
    });

    it('should return local orders', async () => {
      localRepoMock.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({ id: 'local-1' }),
      });

      orderRepoMock.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([{ id: 'order-1' }]),
      });

      const result = await service.getOrdersByLocal('local-1');
      expect(result).toEqual([{ id: 'order-1' }]);
    });
  });
});
