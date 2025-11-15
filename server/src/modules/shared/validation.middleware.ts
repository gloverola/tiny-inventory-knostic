import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Invalid request body', 
          details: error.errors 
        });
      }
      next(error);
    }
  };
}

export function validateQuery<T extends z.ZodTypeAny>(schema: T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.query);
      req.query = parsed as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Invalid query parameters', 
          details: error.errors 
        });
      }
      next(error);
    }
  };
}

export function validateParams<T extends z.ZodTypeAny>(schema: T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.params);
      req.params = parsed as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Invalid path parameters', 
          details: error.errors 
        });
      }
      next(error);
    }
  };
}