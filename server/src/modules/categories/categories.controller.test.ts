import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { categoriesController } from './categories.controller.js';
import { categoriesService } from './categories.service.js';
import { AppError } from '../shared/errors.js';

vi.mock('./categories.service.js', () => ({
  categoriesService: {
    create: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('CategoriesController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };
    next = vi.fn() as unknown as NextFunction;
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const categoryData = { name: 'Electronics', description: 'Electronic items' };
      const createdCategory = { id: '1', ...categoryData, createdAt: new Date(), updatedAt: new Date() };
      
      req.body = categoryData;
      vi.mocked(categoriesService.create).mockResolvedValue(createdCategory);

      await categoriesController.create(req as Request, res as Response);

      expect(categoriesService.create).toHaveBeenCalledWith(categoryData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdCategory);
    });

    it('should throw validation error for invalid data', async () => {
      req.body = { name: '' };

      await expect(categoriesController.create(req as Request, res as Response))
        .rejects.toThrow(AppError);
    });
  });

  describe('getAll', () => {
    it('should return all categories with pagination', async () => {
      const result = {
        items: [{
          id: '1',
          name: 'Electronics',
          description: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }],
        total: 1,
        limit: 10,
        offset: 0,
      };

      req.query = { limit: '10', offset: '0' };
      vi.mocked(categoriesService.findAll).mockResolvedValue(result);

      await categoriesController.getAll(req as Request, res as Response);

      expect(categoriesService.findAll).toHaveBeenCalledWith({ limit: 10, offset: 0 });
      expect(res.json).toHaveBeenCalledWith(result);
    });

    it('should handle search parameter', async () => {
      const result = { items: [], total: 0, limit: 10, offset: 0 };
      
      req.query = { search: 'electronics' };
      vi.mocked(categoriesService.findAll).mockResolvedValue(result);

      await categoriesController.getAll(req as Request, res as Response);

      expect(categoriesService.findAll).toHaveBeenCalledWith({ search: 'electronics' });
    });

    it('should handle includeProducts parameter', async () => {
      const result = { items: [], total: 0, limit: 10, offset: 0 };
      
      req.query = { includeProducts: 'true' };
      vi.mocked(categoriesService.findAll).mockResolvedValue(result);

      await categoriesController.getAll(req as Request, res as Response);

      expect(categoriesService.findAll).toHaveBeenCalledWith({ includeProducts: true });
    });
  });

  describe('getById', () => {
    it('should return a category by id', async () => {
      const category = { id: '1', name: 'Electronics', description: 'Electronic items' };
      
      req.params = { id: '1' };
      vi.mocked(categoriesService.findById).mockResolvedValue(category as any);

      await categoriesController.getById(req as Request, res as Response);

      expect(categoriesService.findById).toHaveBeenCalledWith('1', undefined);
      expect(res.json).toHaveBeenCalledWith(category);
    });

    it('should return category with products when includeProducts is true', async () => {
      const categoryWithProducts = {
        id: '1',
        name: 'Electronics',
        products: [{ id: 'p1', name: 'Laptop' }],
      };
      
      req.params = { id: '1' };
      req.query = { includeProducts: 'true' };
      vi.mocked(categoriesService.findById).mockResolvedValue(categoryWithProducts as any);

      await categoriesController.getById(req as Request, res as Response);

      expect(categoriesService.findById).toHaveBeenCalledWith('1', true);
      expect(res.json).toHaveBeenCalledWith(categoryWithProducts);
    });

    it('should throw 404 error when category not found', async () => {
      req.params = { id: '1' };
      vi.mocked(categoriesService.findById).mockResolvedValue(null);

      await expect(categoriesController.getById(req as Request, res as Response))
        .rejects.toThrow(AppError);
    });

    it('should throw validation error for invalid uuid', async () => {
      req.params = { id: 'invalid-uuid' };

      await expect(categoriesController.getById(req as Request, res as Response))
        .rejects.toThrow(AppError);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updateData = { name: 'Updated Electronics' };
      const updatedCategory = {
        id: '1',
        ...updateData,
        description: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      req.params = { id: '1' };
      req.body = updateData;
      vi.mocked(categoriesService.update).mockResolvedValue(updatedCategory);

      await categoriesController.update(req as Request, res as Response);

      expect(categoriesService.update).toHaveBeenCalledWith('1', updateData);
      expect(res.json).toHaveBeenCalledWith(updatedCategory);
    });

    it('should throw error when no fields to update', async () => {
      req.params = { id: '1' };
      req.body = {};

      await expect(categoriesController.update(req as Request, res as Response))
        .rejects.toThrow(AppError);
    });

    it('should throw 404 error when category not found', async () => {
      req.params = { id: '1' };
      req.body = { name: 'Updated' };
      vi.mocked(categoriesService.update).mockResolvedValue(null);

      await expect(categoriesController.update(req as Request, res as Response))
        .rejects.toThrow(AppError);
    });
  });

  describe('delete', () => {
    it('should delete a category', async () => {
      req.params = { id: '1' };
      vi.mocked(categoriesService.delete).mockResolvedValue(true);

      await categoriesController.delete(req as Request, res as Response);

      expect(categoriesService.delete).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should throw 404 error when category not found', async () => {
      req.params = { id: '1' };
      vi.mocked(categoriesService.delete).mockResolvedValue(false);

      await expect(categoriesController.delete(req as Request, res as Response))
        .rejects.toThrow(AppError);
    });
  });
});