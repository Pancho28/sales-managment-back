import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../authorization/guards';
import { User } from '../users/entities';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductService = {
    getProducts: jest.fn(),
    getCategoryProducts: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    activeProduct: jest.fn(),
    inactiveProduct: jest.fn(),
    createCategory: jest.fn(),
    updateCategory: jest.fn(),
    getCategories: jest.fn(),
    getProductsSummaryByPrice: jest.fn(),
    getProductsSummaryForEmployee: jest.fn(),
  };

  const mockUser = {
    id: 'user-id',
    username: 'test',
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return products array', async () => {
      const resultData = [{ id: 'p1', name: 'Product 1' }];
      mockProductService.getProducts.mockResolvedValue(resultData);

      const result = await controller.getProducts(mockUser);

      expect(result).toEqual({ statusCode: 200, products: resultData });
      expect(service.getProducts).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('createProduct', () => {
    it('should return created product id', async () => {
      const createDto: any = { name: 'Product 1', price: 100 };
      const newProduct = { id: 'prod-1' };
      mockProductService.createProduct.mockResolvedValue(newProduct);

      const result = await controller.createProduct(createDto);

      expect(result).toEqual({
        statusCode: 201,
        message: 'Producto creado exitosamente',
        productId: 'prod-1',
      });
      expect(service.createProduct).toHaveBeenCalledWith(createDto);
    });
  });

  describe('getCategories', () => {
    it('should return categories', async () => {
      const categoriesData = [{ id: 'c1', name: 'Cat 1' }];
      mockProductService.getCategories.mockResolvedValue(categoriesData);

      const result = await controller.getCategories();

      expect(result).toEqual({ statusCode: 200, categories: categoriesData });
    });
  });
});
