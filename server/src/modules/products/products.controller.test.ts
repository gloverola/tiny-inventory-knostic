import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import * as controller from './products.controller';
import * as productsService from './products.service';

// Mock the service module
vi.mock('./products.service');

describe('Products Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      params: {},
      query: {},
      body: {},
    };
    res = {
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };
    next = vi.fn() as unknown as NextFunction;
    vi.clearAllMocks();
  });

  describe('listProducts', () => {
    it('should return paginated products', async () => {
      const mockResult = {
        products: [{
          id: '1',
          name: 'Product 1',
          category: 'Electronics',
          categoryId: '660e8400-e29b-41d4-a716-446655440000',
          price: '99.99',
          quantity: 10,
          storeId: '550e8400-e29b-41d4-a716-446655440000',
          imageUrl: 'https://example.com/product1.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        }],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
        filters: {},
      };
      vi.mocked(productsService.getAllProducts).mockResolvedValue(mockResult);

      req.query = { page: '1', limit: '10' };
      await controller.listProducts(req as Request, res as Response, next);

      expect(productsService.getAllProducts).toHaveBeenCalledWith(1, 10, {});
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should apply filters', async () => {
      const mockResult = {
        products: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        filters: { category: 'Electronics', categoryId: '660e8400-e29b-41d4-a716-446655440000', minPrice: 10, maxPrice: 100 },
      };
      vi.mocked(productsService.getAllProducts).mockResolvedValue(mockResult);

      req.query = { 
        page: '1', 
        limit: '10', 
        category: 'Electronics',
        categoryId: '660e8400-e29b-41d4-a716-446655440000',
        minPrice: '10',
        maxPrice: '100'
      };
      await controller.listProducts(req as Request, res as Response, next);

      expect(productsService.getAllProducts).toHaveBeenCalledWith(1, 10, {
        category: 'Electronics',
        categoryId: '660e8400-e29b-41d4-a716-446655440000',
        minPrice: 10,
        maxPrice: 100
      });
    });

    it('should handle validation errors', async () => {
      req.query = { page: '-1' }; // Invalid page
      await controller.listProducts(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Invalid query parameters' })
      );
    });
  });

  describe('getProduct', () => {
    it('should return a product by id', async () => {
      const mockProduct = {
        id: '1',
        name: 'Product 1',
        category: 'Electronics',
        categoryId: '660e8400-e29b-41d4-a716-446655440000',
        price: '99.99',
        quantity: 10,
        storeId: '550e8400-e29b-41d4-a716-446655440000',
        imageUrl: 'https://example.com/product1.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      vi.mocked(productsService.getProductById).mockResolvedValue(mockProduct);

      req.params = { id: '1' };
      await controller.getProduct(req as Request, res as Response, next);

      expect(productsService.getProductById).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    it('should return 404 if product not found', async () => {
      vi.mocked(productsService.getProductById).mockResolvedValue(null as any);

      req.params = { id: '1' };
      await controller.getProduct(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const newProduct = {
        storeId: '550e8400-e29b-41d4-a716-446655440000',
        name: 'New Product',
        category: 'Electronics',
        categoryId: '660e8400-e29b-41d4-a716-446655440000',
        price: 99.99,
        quantity: 10,
        imageUrl: 'https://example.com/new-product.jpg'
      };
      const createdProduct = {
        id: '1',
        ...newProduct,
        price: '99.99',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      vi.mocked(productsService.createProduct).mockResolvedValue(createdProduct);

      req.body = newProduct;
      await controller.createProduct(req as Request, res as Response, next);

      expect(productsService.createProduct).toHaveBeenCalledWith({
        ...newProduct,
        price: '99.99'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdProduct);
    });

    it('should handle validation errors', async () => {
      req.body = { 
        name: 'Product',
        // Missing required fields
      };
      await controller.createProduct(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Invalid request body' })
      );
    });

    it('should handle invalid image URL', async () => {
      req.body = {
        storeId: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Product',
        category: 'Electronics',
        price: 99.99,
        quantity: 10,
        imageUrl: 'invalid-url' // Not a valid URL
      };
      await controller.createProduct(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Invalid request body' })
      );
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const updateData = { name: 'Updated Product', price: 150 };
      const updatedProduct = {
        id: '1',
        name: 'Updated Product',
        price: '150',
        category: 'Electronics',
        categoryId: '660e8400-e29b-41d4-a716-446655440000',
        quantity: 10,
        storeId: '550e8400-e29b-41d4-a716-446655440000',
        imageUrl: 'https://example.com/updated-product.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      vi.mocked(productsService.updateProduct).mockResolvedValue(updatedProduct);

      req.params = { id: '1' };
      req.body = updateData;
      await controller.updateProduct(req as Request, res as Response, next);

      expect(productsService.updateProduct).toHaveBeenCalledWith('1', {
        name: 'Updated Product',
        price: '150'
      });
      expect(res.json).toHaveBeenCalledWith(updatedProduct);
    });

    it('should return 400 if no fields to update', async () => {
      req.params = { id: '1' };
      req.body = {};
      await controller.updateProduct(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'No fields to update' });
    });

    it('should return 404 if product not found', async () => {
      vi.mocked(productsService.updateProduct).mockResolvedValue(null as any);

      req.params = { id: '1' };
      req.body = { name: 'Updated' };
      await controller.updateProduct(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const deletedProduct = {
        id: '1',
        name: 'Product 1',
        category: 'Electronics',
        categoryId: '660e8400-e29b-41d4-a716-446655440000',
        price: '99.99',
        quantity: 10,
        storeId: '550e8400-e29b-41d4-a716-446655440000',
        imageUrl: 'https://example.com/product1.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      vi.mocked(productsService.deleteProduct).mockResolvedValue(deletedProduct);

      req.params = { id: '1' };
      await controller.deleteProduct(req as Request, res as Response, next);

      expect(productsService.deleteProduct).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 404 if product not found', async () => {
      vi.mocked(productsService.deleteProduct).mockResolvedValue(null as any);

      req.params = { id: '1' };
      await controller.deleteProduct(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });
  });
});