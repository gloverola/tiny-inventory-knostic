import { eq, ilike, sql, desc, asc } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { categories, products, type Category, type NewCategory } from '../../db/schema.js';

export interface GetCategoriesOptions {
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'name' | 'createdAt';
  order?: 'asc' | 'desc';
  includeProducts?: boolean;
}

export class CategoriesService {
  async create(data: NewCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(data)
      .returning();
    return category;
  }

  async findAll(options: GetCategoriesOptions = {}) {
    const {
      search,
      limit = 10,
      offset = 0,
      sortBy = 'createdAt',
      order = 'desc',
      includeProducts = false,
    } = options;

    const orderByColumn = sortBy === 'name' ? categories.name : categories.createdAt;
    const orderDirection = order === 'asc' ? asc : desc;

    // Build base query
    const baseQuery = db.select().from(categories);

    let items;
    let count;

    if (search) {
      const searchCondition = sql`${categories.name} ILIKE ${`%${search}%`} OR ${categories.description} ILIKE ${`%${search}%`}`;

      items = await baseQuery
        .where(searchCondition)
        .orderBy(orderDirection(orderByColumn))
        .limit(limit)
        .offset(offset);

      const [countResult] = await db
        .select({ count: sql`count(*)::int` })
        .from(categories)
        .where(searchCondition);
      count = countResult.count;
    } else {
      items = await baseQuery
        .orderBy(orderDirection(orderByColumn))
        .limit(limit)
        .offset(offset);

      const [countResult] = await db
        .select({ count: sql`count(*)::int` })
        .from(categories);
      count = countResult.count;
    }

    return {
      items,
      total: count,
      limit,
      offset,
    };
  }

  async findById(id: string, includeProducts = false): Promise<Category | null> {
    const result = await db.query.categories.findFirst({
      where: eq(categories.id, id),
      with: includeProducts ? { products: true } : undefined,
    });

    return result ?? null;
  }

  async update(id: string, data: Partial<NewCategory>): Promise<Category | null> {
    const [updated] = await db
      .update(categories)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();
    
    return updated || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning({ id: categories.id });
    
    return result.length > 0;
  }

  async getProductsByCategory(categoryId: string) {
    return await db
      .select()
      .from(products)
      .where(eq(products.categoryId, categoryId));
  }
}

export const categoriesService = new CategoriesService();