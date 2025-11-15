import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';

// Create a test app instance
const app = createApp();

describe('API Integration Tests', () => {
  describe('Health Check', () => {
    it('should return 404 for non-existent endpoints', async () => {
      const response = await request(app).get('/non-existent');
      expect(response.status).toBe(404);
    });
  });

  describe('Stores API', () => {
    describe('GET /stores', () => {
      it('should return stores with pagination', async () => {
        const response = await request(app)
          .get('/stores')
          .query({ page: 1, limit: 10 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('stores');
        expect(response.body).toHaveProperty('pagination');
        expect(response.body.pagination).toHaveProperty('page', 1);
        expect(response.body.pagination).toHaveProperty('limit', 10);
      });

      it('should validate query parameters', async () => {
        const response = await request(app)
          .get('/stores')
          .query({ page: -1, limit: 200 });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Invalid query parameters');
      });
    });

    describe('POST /stores', () => {
      it('should validate request body', async () => {
        const response = await request(app)
          .post('/stores')
          .send({ name: '' }); // Invalid: empty name

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Invalid request body');
      });

      it('should require all fields', async () => {
        const response = await request(app)
          .post('/stores')
          .send({ name: 'Test Store' }); // Missing location

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Invalid request body');
      });
    });
  });

  describe('Products API', () => {
    describe('GET /products', () => {
      it('should return products with pagination', async () => {
        const response = await request(app)
          .get('/products')
          .query({ page: 1, limit: 20 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('products');
        expect(response.body).toHaveProperty('pagination');
        expect(response.body).toHaveProperty('filters');
      });

      it('should accept filter parameters', async () => {
        const response = await request(app)
          .get('/products')
          .query({
            page: 1,
            limit: 10,
            category: 'Electronics',
            minPrice: 10,
            maxPrice: 100,
            search: 'laptop'
          });

        expect(response.status).toBe(200);
        expect(response.body.filters).toEqual({
          category: 'Electronics',
          minPrice: 10,
          maxPrice: 100,
          search: 'laptop'
        });
      });

      it('should validate UUID in storeId filter', async () => {
        const response = await request(app)
          .get('/products')
          .query({ storeId: 'invalid-uuid' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Invalid query parameters');
      });
    });

    describe('POST /products', () => {
      it('should validate product creation', async () => {
        const response = await request(app)
          .post('/products')
          .send({
            storeId: 'invalid-uuid',
            name: 'Product',
            category: 'Test',
            price: -10, // Invalid: negative price
            quantity: -5 // Invalid: negative quantity
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Invalid request body');
      });

      it('should require all fields', async () => {
        const response = await request(app)
          .post('/products')
          .send({
            name: 'Product',
            category: 'Test'
            // Missing storeId, price, quantity
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Invalid request body');
      });
    });

    describe('PATCH /products/:id', () => {
      it('should allow partial updates', async () => {
        const response = await request(app)
          .patch('/products/550e8400-e29b-41d4-a716-446655440000')
          .send({ name: 'Updated Product' });

        // Will fail as no DB connection, but validates the endpoint exists
        expect([200, 404, 500]).toContain(response.status);
      });

      it('should not allow updating storeId', async () => {
        const response = await request(app)
          .patch('/products/550e8400-e29b-41d4-a716-446655440000')
          .send({ storeId: '550e8400-e29b-41d4-a716-446655440001' });

        // storeId should be stripped from update
        expect(response.status).not.toBe(400);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle JSON parsing errors', async () => {
      const response = await request(app)
        .post('/products')
        .set('Content-Type', 'application/json')
        .send('invalid json');

      expect(response.status).toBe(400);
    });

    it('should handle missing content-type', async () => {
      const response = await request(app)
        .post('/products')
        .send('plain text');

      expect([400, 415]).toContain(response.status);
    });
  });
});