import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product, Category } from './entities';
import { Local, User } from '../users/entities';
import { repositoryMockFactory } from '../helpers/repository-mock.factory';
import { Roles, Status } from '../helpers/enum';
import { UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let productRepoMock: any;
  let localRepoMock: any;
  let categoryRepoMock: any;

  const mockAdminUser = { id: 'admin-1', username: 'admin', role: Roles.ADMIN } as User;
  const mockSellerUser = { id: 'seller-1', username: 'seller', role: Roles.SELLER } as User;
  
  const mockLocal = { id: 'local-1', name: 'My Local', user: mockSellerUser } as Local;
  const mockCategory = { id: 'cat-1', name: 'Drinks' } as Category;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: getRepositoryToken(Product), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(Local), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(Category), useFactory: repositoryMockFactory },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepoMock = module.get(getRepositoryToken(Product));
    localRepoMock = module.get(getRepositoryToken(Local));
    categoryRepoMock = module.get(getRepositoryToken(Category));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProducts', () => {
    it('should throw UnauthorizedException if role is invalid', async () => {
      const invalidUser = { ...mockSellerUser, role: 'UNKNOWN' } as User;
      await expect(service.getProducts(invalidUser)).rejects.toThrow(UnauthorizedException);
    });

    it('should get products for ADMIN', async () => {
      productRepoMock.createQueryBuilder.mockReturnValue({
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      });
      const result = await service.getProducts(mockAdminUser);
      expect(result).toEqual([]);
      expect(productRepoMock.createQueryBuilder).toHaveBeenCalled();
    });

    it('should get products for SELLER linked to local', async () => {
      localRepoMock.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockLocal),
      });
      productRepoMock.createQueryBuilder.mockReturnValue({
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([{ id: 'p1' }]),
      });
      
      const result = await service.getProducts(mockSellerUser);
      
      expect(result).toEqual([{ id: 'p1' }]);
      expect(localRepoMock.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('createProduct', () => {
    it('should throw NotFoundException if local not found', async () => {
      localRepoMock.findOneBy.mockResolvedValue(null);
      await expect(service.createProduct({ localId: 'missing', categoryId: 'cat-1', name: 'p' } as any))
        .rejects.toThrow(NotFoundException);
    });

    it('should create product successfully', async () => {
      localRepoMock.findOneBy.mockResolvedValue(mockLocal);
      categoryRepoMock.findOneBy.mockResolvedValue(mockCategory);
      productRepoMock.findOneBy.mockResolvedValue(null); // Does not exist
      
      const newProduct = { id: 'p1', name: 'Product 1' };
      productRepoMock.create.mockReturnValue(newProduct);

      const result = await service.createProduct({ localId: 'local-1', categoryId: 'cat-1', name: 'Product 1' } as any);

      expect(result).toEqual(newProduct);
      expect(productRepoMock.save).toHaveBeenCalledWith(newProduct);
    });
  });

  describe('createCategory', () => {
    it('should throw UnauthorizedException if not admin', async () => {
      await expect(service.createCategory(mockSellerUser, { name: 'Cat', date: new Date() }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should create category if admin', async () => {
      categoryRepoMock.findOneBy.mockResolvedValue(null);
      categoryRepoMock.create.mockReturnValue({ name: 'Cat' });

      const result = await service.createCategory(mockAdminUser, { name: 'Cat', date: new Date() });
      expect(result.name).toBe('Cat');
      expect(categoryRepoMock.save).toHaveBeenCalled();
    });
  });
});
