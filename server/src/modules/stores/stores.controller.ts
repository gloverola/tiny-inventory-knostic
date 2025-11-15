import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as storesService from "./stores.service.js";

const createStoreSchema = z.object({
  name: z.string().min(1).max(255),
  location: z.string().min(1).max(255),
});

const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export async function listStores(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = paginationSchema.parse(req.query);
    const result = await storesService.getAllStores(query.page, query.limit);
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid query parameters", details: error.errors });
    }
    next(error);
  }
}

export async function getStore(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const store = await storesService.getStoreById(id);

    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    res.json(store);
  } catch (error) {
    next(error);
  }
}

export async function createStore(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = createStoreSchema.parse(req.body);
    const store = await storesService.createStore(data);
    res.status(201).json(store);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid request body", details: error.errors });
    }
    next(error);
  }
}

export async function getStoreProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const querySchema = paginationSchema.extend({
      category: z.string().optional(),
    });

    const query = querySchema.parse(req.query);

    // Check if store exists
    const store = await storesService.getStoreById(id);
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    const result = await storesService.getStoreProducts(
      id,
      query.page,
      query.limit,
      query.category
    );

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid query parameters", details: error.errors });
    }
    next(error);
  }
}
