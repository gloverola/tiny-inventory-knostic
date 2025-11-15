import { eq, sql, count, and, desc } from "drizzle-orm";
import { db, stores, products } from "../../db/index.js";
import type { NewStore } from "../../db/schema.js";

export async function getAllStores(page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  const [items, totalCount] = await Promise.all([
    db
      .select()
      .from(stores)
      .orderBy(desc(stores.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(stores),
  ]);

  return {
    stores: items,
    pagination: {
      page,
      limit,
      total: totalCount[0].count,
      totalPages: Math.ceil(totalCount[0].count / limit),
    },
  };
}

export async function getStoreById(id: string) {
  const result = await db.select().from(stores).where(eq(stores.id, id));
  return result[0] || null;
}

export async function createStore(data: NewStore) {
  const result = await db.insert(stores).values(data).returning();
  return result[0];
}

export async function getStoreProducts(
  storeId: string,
  page = 1,
  limit = 10,
  category?: string
) {
  const offset = (page - 1) * limit;

  const conditions = [eq(products.storeId, storeId)];
  if (category) {
    conditions.push(eq(products.category, category));
  }

  const whereClause =
    conditions.length > 1 ? and(...conditions) : conditions[0];

  const [items, totalCount] = await Promise.all([
    db.select().from(products).where(whereClause).limit(limit).offset(offset),
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
  };
}
