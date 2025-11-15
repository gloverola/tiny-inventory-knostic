import { eq, and, gte, lte, lt, count, like, or, desc } from "drizzle-orm";
import { db, products } from "../../db/index.js";
import type { NewProduct } from "../../db/schema.js";

interface ProductFilters {
  category?: string;
  categoryId?: string;
  storeId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  stock?: "low_stock" | "in_stock" | "out_of_stock";
}

export async function getAllProducts(
  page = 1,
  limit = 10,
  filters: ProductFilters = {}
) {
  const offset = (page - 1) * limit;
  const conditions = [];

  if (filters.category) {
    conditions.push(eq(products.category, filters.category));
  }
  if (filters.categoryId) {
    conditions.push(eq(products.categoryId, filters.categoryId));
  }
  if (filters.storeId) {
    conditions.push(eq(products.storeId, filters.storeId));
  }
  if (filters.minPrice !== undefined) {
    conditions.push(gte(products.price, filters.minPrice.toString()));
  }
  if (filters.maxPrice !== undefined) {
    conditions.push(lte(products.price, filters.maxPrice.toString()));
  }
  if (filters.search) {
    conditions.push(
      or(
        like(products.name, `%${filters.search}%`),
        like(products.category, `%${filters.search}%`)
      )!
    );
  }
  if (filters.stock) {
    if (filters.stock === "low_stock") {
      conditions.push(lt(products.quantity, 10));
    } else if (filters.stock === "in_stock") {
      conditions.push(gte(products.quantity, 10));
    } else if (filters.stock === "out_of_stock") {
      conditions.push(eq(products.quantity, 0));
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [items, totalCount] = await Promise.all([
    db
      .select()
      .from(products)
      .where(whereClause)
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(products).where(whereClause),
  ]);

  return {
    products: items,
    pagination: {
      page,
      limit,
      total: totalCount[0].count,
      totalPages: Math.ceil(totalCount[0].count / limit),
    },
    filters,
  };
}

export async function getProductById(id: string) {
  const result = await db.select().from(products).where(eq(products.id, id));
  return result[0] || null;
}

export async function createProduct(data: NewProduct) {
  const result = await db.insert(products).values(data).returning();
  return result[0];
}

export async function updateProduct(id: string, data: Partial<NewProduct>) {
  const result = await db
    .update(products)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id))
    .returning();
  return result[0] || null;
}

export async function deleteProduct(id: string) {
  const result = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning();
  return result[0] || null;
}
