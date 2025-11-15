import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as productsService from './products.service.js';

const createProductSchema = z.object({
  storeId: z.string().uuid(),
  name: z.string().min(1).max(255),
  category: z.string().min(1).max(100),
  categoryId: z.string().uuid().optional(),
  price: z.coerce.number().positive(),
  quantity: z.coerce.number().int().min(0),
  imageUrl: z.string().url().max(500).optional(),
});

const updateProductSchema = createProductSchema.partial().omit({ storeId: true });

const productFiltersSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  category: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  storeId: z.string().uuid().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  search: z.string().optional(),
});

export async function listProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const query = productFiltersSchema.parse(req.query);
    const { page, limit, ...filters } = query;
    
    const result = await productsService.getAllProducts(page, limit, filters);
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid query parameters', details: error.errors });
    }
    next(error);
  }
}

export async function getProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const product = await productsService.getProductById(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createProductSchema.parse(req.body);
    const product = await productsService.createProduct({
      ...data,
      price: data.price.toString(),
    });
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request body', details: error.errors });
    }
    next(error);
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const data = updateProductSchema.parse(req.body);
    
    // Check if any fields are actually being updated
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    // Convert price to string if present
    const updateData: any = { ...data };
    if (data.price !== undefined) {
      updateData.price = data.price.toString();
    }
    
    const product = await productsService.updateProduct(id, updateData);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request body', details: error.errors });
    }
    next(error);
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    
    const product = await productsService.deleteProduct(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}