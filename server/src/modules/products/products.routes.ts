import { Router } from 'express';
import * as controller from './products.controller.js';

const router = Router();

// GET /products - List all products with filters
router.get('/', controller.listProducts);

// GET /products/:id - Get product details
router.get('/:id', controller.getProduct);

// POST /products - Create new product
router.post('/', controller.createProduct);

// PATCH /products/:id - Update product
router.patch('/:id', controller.updateProduct);

// DELETE /products/:id - Delete product
router.delete('/:id', controller.deleteProduct);

export default router;