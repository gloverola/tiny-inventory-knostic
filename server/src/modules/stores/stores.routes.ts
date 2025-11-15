import { Router } from 'express';
import * as controller from './stores.controller.js';

const router = Router();

// GET /stores - List all stores
router.get('/', controller.listStores);

// GET /stores/:id - Get store details
router.get('/:id', controller.getStore);

// POST /stores - Create new store
router.post('/', controller.createStore);

// GET /stores/:id/products - List products in store
router.get('/:id/products', controller.getStoreProducts);

// GET /stores/:id/analytics - Get store analytics
router.get('/:id/analytics', controller.getStoreAnalytics);

export default router;