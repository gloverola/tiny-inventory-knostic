import { Request, Response } from 'express';
import { z } from 'zod';
import { categoriesService } from './categories.service.js';
import { AppError } from '../shared/errors.js';

const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

const updateCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});

const getCategoriesQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.string().transform(Number).pipe(z.number().positive()).optional(),
  offset: z.string().transform(Number).pipe(z.number().min(0)).optional(),
  sortBy: z.enum(['name', 'createdAt']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  includeProducts: z.string().transform((val) => val === 'true').optional(),
});

const idParamSchema = z.object({
  id: z.string().uuid(),
});

const getCategoryQuerySchema = z.object({
  includeProducts: z.string().transform((val) => val === 'true').optional(),
});

export class CategoriesController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = createCategorySchema.parse(req.body);
      const category = await categoriesService.create(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError(400, 'Validation error', error.errors);
      }
      throw error;
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const validatedQuery = getCategoriesQuerySchema.parse(req.query);
      const result = await categoriesService.findAll(validatedQuery);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError(400, 'Validation error', error.errors);
      }
      throw error;
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = idParamSchema.parse(req.params);
      const { includeProducts } = getCategoryQuerySchema.parse(req.query);
      
      const category = await categoriesService.findById(id, includeProducts);
      
      if (!category) {
        throw new AppError(404, 'Category not found');
      }
      
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError(400, 'Validation error', error.errors);
      }
      throw error;
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = updateCategorySchema.parse(req.body);
      
      if (Object.keys(validatedData).length === 0) {
        throw new AppError(400, 'No fields to update');
      }
      
      const updated = await categoriesService.update(id, validatedData);
      
      if (!updated) {
        throw new AppError(404, 'Category not found');
      }
      
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError(400, 'Validation error', error.errors);
      }
      throw error;
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = idParamSchema.parse(req.params);
      const deleted = await categoriesService.delete(id);
      
      if (!deleted) {
        throw new AppError(404, 'Category not found');
      }
      
      res.status(204).send();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError(400, 'Validation error', error.errors);
      }
      throw error;
    }
  }
}

export const categoriesController = new CategoriesController();