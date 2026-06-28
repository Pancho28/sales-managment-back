import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../authorization/guards';
import { User } from '../users/entities';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const mockOrderService = {
    getOrders: jest.fn(),
    getOrdersByLocal: jest.fn(),
    getOrderById: jest.fn(),
    createorder: jest.fn(),
    getOrdersSummaryByPaymentType: jest.fn(),
    createPaymentType: jest.fn(),
    updatePaymentType: jest.fn(),
    getPaymentTypes: jest.fn(),
    getOrdersNotDelivered: jest.fn(),
    orderDelivered: jest.fn(),
    getOrdersUnpaid: jest.fn(),
    orderPaid: jest.fn(),
  };

  const mockUser = { id: 'user-1', username: 'testuser' } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOrders', () => {
    it('should return orders', async () => {
      mockOrderService.getOrders.mockResolvedValue([]);
      const result = await controller.getOrders(mockUser);
      expect(result).toEqual({ statusCode: 200, orders: [] });
      expect(service.getOrders).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('createOrder', () => {
    it('should create order', async () => {
      mockOrderService.createorder.mockResolvedValue(undefined);
      const dto: any = { totalDl: 10, items: [] };
      const result = await controller.createOrder(mockUser, dto);
      expect(result).toEqual({ statusCode: 201, message: 'Orden creada' });
      expect(service.createorder).toHaveBeenCalledWith(dto, mockUser);
    });
  });

  describe('orderPaid', () => {
    it('should mark order as paid', async () => {
      mockOrderService.orderPaid.mockResolvedValue(undefined);
      const dto: any = { payments: [] };
      const result = await controller.orderPaid(mockUser, 'order-1', dto);
      expect(result).toEqual({ statusCode: 201, message: 'Orden pagada' });
      expect(service.orderPaid).toHaveBeenCalledWith(mockUser, 'order-1', dto);
    });
  });
});
